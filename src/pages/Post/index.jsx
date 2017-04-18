/** @jsx Inferno */
import Inferno from 'inferno';
import Component from 'inferno-component';
import { Link } from 'inferno-router';
import { Spinner, SvgIcon } from '../../components';
import styles from './post.css';

// TODO: IE cannot handle chinese characters in url?
class Post extends Component {
  static loadComment() {
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config() {
          this.page.identifier = this.props.post.title;
          this.page.url = location.origin + location.pathname;
        },
      });
    } else {
      /* eslint-disable */
      var disqus_config = function () {
      this.page.identifier = this.props.post.title;
      this.page.url = location.href + location.pathname;
      };
      (function() { // DON'T EDIT BELOW THIS LINE
      var d = document, s = d.createElement('script');
      s.src = '//atalktome.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
      })();
    /* eslint-enable */
    }
  }

  constructor() {
    super();
    this.state = {
      fetching: false,
      readBtnText: '朗读文章',
    };

    this.readPost = this.readPost.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.fetchPost();

    if ('speechSynthesis' in window) {
      this.showReadBtn = true;
      this.setUtterance();
    }

    // load comments only after the post itself has been loaded
    this.timer = setInterval(() => {
      if (this.props.post.title) {
        Post.loadComment();
        clearInterval(this.timer);
      }
    }, 5000);
  }

  componentDidUpdate() {
    const { title } = this.props.post;
    if (title) {
      document.title = title;
    }

    if ('speechSynthesis' in window) {
      if (this.utterance) {
        this.utterance.text = this.getPostText();
      } else {
        this.setUtterance();
      }
    }
  }

  componentWillUnmount() {
    // if comments haven't been loaded, cancle it
    clearInterval(this.timer);

    this.props.update({ post: {} });

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  fetchPost() {
    this.setState({ fetching: true });

    fetch(`/json${this.context.router.url}`)
      .then(res => res.json())
      .then(({ success, result }) => {
        if (success) {
          this.props.update(result);
          this.setState({ fetching: false });
        }
      });
  }

  getPostText() {
    const el = document.createElement('div');
    el.innerHTML = this.props.post.content;
    return el.textContent;
  }

  setUtterance() {
    const { content } = this.props.post;

    if (content) {
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = this.getPostText();

      utterance.addEventListener('start', () => this.changeReadBtnText('暂停朗读'));
      utterance.addEventListener('pause', () => this.changeReadBtnText('继续朗读'));
      utterance.addEventListener('resume', () => this.changeReadBtnText('暂停朗读'));
      utterance.addEventListener('end', () => this.changeReadBtnText('重新朗读'));

      this.utterance = utterance;

      // don't know why, but the speech might continue dispite the page being refreshed or closed
      // so I've to cancel it manually
      window.addEventListener('beforeunload', () => {
        speechSynthesis.cancel();
      });
    }
  }

  changeReadBtnText(readBtnText) {
    this.setState({ ...this.state, readBtnText });
  }

  readPost() {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    } else if (speechSynthesis.speaking) {
      speechSynthesis.pause();
    } else {
      this.changeReadBtnText('处理中...');
      speechSynthesis.speak(this.utterance);
    }
  }

  render() {
    const { post, update } = this.props;
    const isSpinning = !post.title && this.state.fetching;

    return (
      <div>
        {
          isSpinning ? <Spinner /> : (
            <div>
              <article className={styles.article}>
                <header className={styles.header}>
                  <h1 className={styles.title}>{post.title}</h1>
                  <section className={styles.meta}>
                    <SvgIcon name="calendar" />
                    <time>{post.date}</time>
                    <SvgIcon name="tag" />
                    {post.tags ? (
                      <ul className={styles.tags}>
                        {
                          post.tags.map(tag => (
                            <li className={styles.tag} key={tag}>
                              <Link to={`/blog?tag=${tag}`} onClick={() => update({ tag })}>{tag}</Link>
                            </li>
                          ))
                        }
                      </ul>
                    ) : null}
                  </section>
                </header>
                <button
                  className={this.showReadBtn ? styles.read : styles.readHidden}
                  aria-hidden="true"
                  onClick={this.readPost}
                >{this.state.readBtnText}</button>
                <div
                  className={styles.content}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </article>

              <section className={styles.comment}>
                <h2 className={styles.commentTitle}>评论</h2>
                <div id="disqus_thread" />
              </section>
            </div>
          )
        }
      </div>
    );
  }
}

export default Post;

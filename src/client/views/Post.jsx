/** @jsx Inferno */
import Inferno from 'inferno';
import Component from 'inferno-component';
import { Link } from 'inferno-router';

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

    // load comments later
    this.timer = setTimeout(Post.loadComment, 5000);
  }

  componentDidUpdate() {
    document.title = this.props.post.title;

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
    clearTimeout(this.timer);

    this.props.update({ post: {} });

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  fetchPost() {
    fetch(`${this.context.router.url}?json=true`)
      .then(res => res.json())
      .then(({ success, result }) => {
        if (success) {
          this.props.update(result);
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
    const btnClassName = `btn article-read${this.showReadBtn ? '' : ' hidden'}`;

    return (
      <main className="app-main">
        <article className="article">
          <h2 className="article-title">{post.title}</h2>
          <section className="article-meta">
            <svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="/icons.svg#icon-calendar" />' }} />
            <time className="article-time">{post.date}</time>
            <svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="/icons.svg#icon-tag" />' }} />
            {post.tags ? (
              <ul className="article-tags">
                {
                  post.tags.map(tag => (
                    <li className="article-tag" key={tag}>
                      <Link to={`/blog?tag=${tag}`} onClick={() => update({ tag })}>{tag}</Link>
                    </li>
                  ))
                }
              </ul>
            ) : null}
          </section>
          <button
            className={btnClassName}
            aria-hidden="true"
            onClick={this.readPost}
          >{this.state.readBtnText}</button>
          <section
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <section id="disqus_thread" />
      </main>
    );
  }
}

export default Post;

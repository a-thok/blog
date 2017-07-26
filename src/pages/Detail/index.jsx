import Inferno from 'inferno';
import Component from 'inferno-component';
import { Link } from 'inferno-router';
import { connect } from 'inferno-redux';
import { Spinner, UtterButton } from '../../components';
import styles from './detail.css';
import { fetchPost } from '../../store/reducers/post';

// TODO: IE cannot handle chinese characters in url?
class Detail extends Component {
  static loadComments() {
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
      window.disqus_config = function () {
      this.page.identifier = this.props.post.title;
      this.page.url = location.href + location.pathname;
      };
      (function() { // DON'T EDIT BELOW THIS LINE
      var d = document, s = d.createElement('script');
      s.src = '//atalktome.disqus.com/embed.js';
      s.setAttribute('data-timestamp', String(Date.now()));
      (d.head || d.body).appendChild(s);
      })();
    /* eslint-enable */
    }
  }

  constructor() {
    super();
    this.state = {
      fetching: true,
      utterance: false,
    };
  }

  componentDidMount() {
    if (this.props.post.title) document.title = this.props.post.title;
    this.fetchPost();
  }

  fetchPost() {
    this.props.dispatch(fetchPost(this.props.params.name))
      .then(() => this.setState({ fetching: false }))
      .then(() => this.setUtterance())
      .then(() => Detail.loadComments());
  }

  setUtterance() {
    this.setState({ utterance: 'speechSynthesis' in window });
  }

  /* eslint-disable react/no-danger */
  render({ post }, { fetching, utterance }) {
    return (
      <div>
        { fetching ? <Spinner /> : null }

        <div hidden={fetching}>
          <article className={styles.article}>
            <header className={styles.header}>
              <h1 className={styles.title}>{post.title}</h1>
              <section className={styles.meta}>
                <svg><use xlinkHref="#icon-calendar" /></svg>
                <time>{post.date}</time>
                <svg><use xlinkHref="#icon-tag" /></svg>
                <ul className={styles.tags}>
                  {post.tags.map(tag => (
                    <li className={styles.tag} key={tag}>
                      <Link to={`/blog?tag=${tag}`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            </header>
            { utterance ? <UtterButton content={post.content} /> : null }
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          <div className={styles.comment}>
            <h2 className={styles.commentTitle}>评论</h2>
            <div id="disqus_thread" />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ post }) => ({ post }),
)(Detail);

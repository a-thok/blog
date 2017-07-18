/** @jsx Inferno */
import Inferno from 'inferno';
import Component from 'inferno-component';
import { Link } from 'inferno-router';
import { Spinner, SvgIcon } from '../../components';
import styles from './post-list.css';

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
    };
  }

  // TODO: what about the browser back button?
  // it doesn't trigger an update
  componentDidMount() {
    document.title = 'Blog - A Talk To me';
    window.scrollTo(0, 0);

    this.fetchPosts(this.props.tag, this.props.page);
  }

  fetchPosts(tag = '', page = 1) {
    fetch(`/json/blog?page=${page}&tag=${encodeURIComponent(tag)}`)
      .then(res => res.json())
      .then(({ success, result }) => {
        if (success) {
          this.props.update(result);
          this.setState({ fetching: false });
        }
      });
  }

  componentWillUpdate(nextProps) {
    const { tag, page } = nextProps.params;
    const { params } = this.props;
    if ((tag && tag !== params.tag) || (page && page !== params.page)) {
      this.fetchPosts(tag, +page);
    }
  }

  handlePager(tag, page) {
    this.setState({ fetching: true });
    this.props.update({ posts: [] });

    this.fetchPosts(tag, page);
  }

  render() {
    const { pages, page, tag, posts } = this.props;
    const prevPage = page - 1;
    const nextPage = page + 1;
    const hasPrevPage = prevPage > 0;
    const hasNextPage = nextPage <= pages;

    return (
      <div className={styles.wrapper}>
        {
          this.state.fetching ? <Spinner /> : null
        }
        <ul className={styles.list}>
          {posts.map(post => (
            <li className={styles.item}>
              <section className={styles.itemLeft}>
                <time>{post.date}</time>
              </section>
              <section className={styles.itemRight}>
                <Link className={styles.itemTitle} to={`/blog/${post.name}`}>
                  <h2>{post.title}</h2>
                </Link>
              </section>
            </li>
          ))}
        </ul>

        <nav className={styles.pager}>
          {hasPrevPage ? (
            <Link
              className={styles.prev}
              to={`/blog?tag=${tag}&page=${prevPage}`}
              title="上一页"
              onClick={() => this.handlePager(tag, prevPage)}
            >
              <SvgIcon name="arrow-left" />
              <span>上一页</span>
            </Link>
          ) : null}

          {hasNextPage ? (
            <Link
              className={styles.next}
              to={`/blog?tag=${tag}&page=${nextPage}`}
              onClick={() => this.handlePager(tag, nextPage)}
              title="下一页"
            >
              <SvgIcon name="arrow-right" />
              <span>下一页</span>
            </Link>
          ) : null}
        </nav>
      </div>
    );
  }
}

export default PostList;

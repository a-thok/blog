import { Component } from 'inferno';
import { Link } from 'inferno-router';
import { connect } from 'inferno-redux';
import { Spinner, Pager } from '../../components';
import { fetchList, resetList } from '../../store/reducers/list';
import { updatePost } from '../../store/reducers/post';
import styles from './list.css';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
    };
  }

  componentDidMount() {
    const { posts } = this.props;
    document.title = 'Blog - A Talk To Me';
    if (!posts.length) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps) {
    const { location: { search } } = this.props;
    if (search !== prevProps.location.search) {
      this.fetchData(search);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetList());
  }

  fetchData(search) {
    const { dispatch } = this.props;

    this.setState({ fetching: true });

    const query = new URLSearchParams(search);
    const page = +(query.get('page') || '1');
    const tag = query.get('tag') || 'all';
    dispatch(fetchList(page, tag))
      .then(() => this.setState({ fetching: false }));
  }

  goToDetail(title) {
    const { dispatch } = this.props;
    dispatch(updatePost({ title }));
  }

  render() {
    const {
      posts, page, tag, total,
    } = this.props;
    const { fetching } = this.state;

    return (
      <div className={styles.wrapper}>
        { fetching ? <Spinner /> : null }

        <ul className={styles.list} hidden={fetching}>
          {posts.map(post => (
            <li className={styles.item}>
              <div className={styles.itemLeft}>
                <time>{post.date}</time>
              </div>
              <div className={styles.itemRight}>
                <Link
                  className={styles.itemTitle}
                  to={`/blog/${post.name}`}
                  onClick={() => this.goToDetail(post.title)}
                >
                  <h2>{post.title}</h2>
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <Pager
          page={page}
          total={total}
          tag={tag}
        />
      </div>
    );
  }
}


export default connect(({
  list: {
    posts, page, total, tag,
  },
}) => ({
  posts, page, total, tag,
}))(List);

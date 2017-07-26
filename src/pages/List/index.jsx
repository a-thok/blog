import Inferno from 'inferno';
import Component from 'inferno-component';
import { Link } from 'inferno-router';
import { connect } from 'inferno-redux';
import { Spinner, Pager } from '../../components';
import { fetchList } from '../../store/reducers/list';
import { updatePost } from '../../store/reducers/post';
import styles from './list.css';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
    };
  }


  componentDidMount() {
    document.title = 'Blog - A Talk To Me';
    const { tag = '', page = 1 } = this.props.params;
    this.fetchData(page, tag);
  }

  // TODO: what about the browser back button? it doesn't trigger an update
  componentWillReceiveProps(nextProps) {
    const { page, tag } = nextProps.params;
    const isPageChanged = page != null && page !== this.props.params.page;
    const isTagChanged = tag != null && tag !== this.props.params.tag;
    if (isPageChanged || isTagChanged) {
      this.fetchData(page, tag);
    }
  }

  fetchData(page, tag) {
    this.setState({ fetching: true });
    this.props.dispatch(fetchList(page, tag))
      .then(() => this.setState({ fetching: false }));
  }

  goToDetail(title) {
    this.props.dispatch(updatePost({ title }));
  }

  render({ posts, ...others }, { fetching }) {
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
                <Link className={styles.itemTitle} to={`/blog/${post.name}`} onClick={() => this.goToDetail(post.title)}>
                  <h2>{post.title}</h2>
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <Pager {...others} />
      </div>
    );
  }
}


export default connect(
  ({ list: { posts, page, total, tag } }) => ({ posts, page, total, tag }),
)(List);

import { Component } from 'inferno';
import { connect } from 'inferno-redux';
import { Spinner } from '../../components';
import { fetchTalk } from '../../store/reducers/talk';
import styles from './home.css';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      fetching: true,
    };
  }

  componentDidMount() {
    document.title = 'A Talk To Me';
    this.fetchData();
  }

  fetchData() {
    const { dispatch } = this.props;
    this.setState({ fetching: true });
    dispatch(fetchTalk())
      .then(() => this.setState({ fetching: false }));
  }

  render() {
    const { talk } = this.props;
    const { fetching } = this.state;

    return (
      <div>
        <blockquote className={styles.quote}>
          { fetching ? <Spinner /> : talk }
        </blockquote>
        <button
          type="button"
          className={styles.btn}
          title="点击切换上方句子"
          onClick={() => this.fetchData()}
        >
          随便说说
        </button>
      </div>
    );
  }
}

export default connect(({ talk }) => ({ talk }))(Home);

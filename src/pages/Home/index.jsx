import Inferno from 'inferno';
import Component from 'inferno-component';
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
    this.setState({ fetching: true });
    this.props.dispatch(fetchTalk())
      .then(() => this.setState({ fetching: false }));
  }

  render({ talk }, { fetching }) {
    return (
      <div>
        <blockquote className={styles.quote}>
          { fetching ? <Spinner /> : talk }
        </blockquote>
        <button
          className={styles.btn}
          title="点击切换上方句子"
          onClick={() => this.fetchData()}
        >随便说说</button>
      </div>
    );
  }
}

export default connect(
  ({ talk }) => ({ talk }),
)(Home);

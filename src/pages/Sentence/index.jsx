/** @jsx Inferno */
import Inferno from 'inferno';
import Component from 'inferno-component';
import { Spinner } from '../../components';
import styles from './sentence.css';

class Sentence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
    };
  }

  componentDidMount() {
    document.title = 'A Talk To Me';
    this.getSentence();
  }

  getSentence() {
    this.setState({ fetching: true });

    fetch('/json/sentence')
      .then(res => res.json())
      .then(({ success, result }) => {
        if (success) {
          this.props.update(result);
          this.setState({ fetching: false });
        }
      });
  }

  render() {
    return (
      <div>
        <blockquote className={styles.quote}>
          {this.state.fetching ? <Spinner /> : this.props.sentence}
        </blockquote>
        <button
          className={styles.btn}
          title="点击切换上方句子"
          onClick={() => this.getSentence()}
        >随便说说</button>
      </div>
    );
  }
}

export default Sentence;

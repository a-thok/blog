/** @jsx Inferno */
import Inferno from 'inferno';
import Component from 'inferno-component';
import Spinner from '../components/Spinner';

class Sentence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
    };
  }

  componentDidMount() {
    document.title = 'A Talk To Me';
  }

  getSentence() {
    this.setState({ fetching: true });

    fetch('/?json=true')
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
      <div className="sentence">
        <blockquote className="sentence-quote">
          {this.state.fetching ? <Spinner /> : this.props.sentence}
        </blockquote>
        <button
          className="btn sentence-btn"
          title="点击切换上方句子"
          onClick={() => this.getSentence()}
        >随便说说</button>
      </div>
    );
  }
}

export default Sentence;

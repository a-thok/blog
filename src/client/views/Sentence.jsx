/** @jsx Inferno */
import Inferno from 'inferno';
import Component from 'inferno-component';

class Sentence extends Component {
  componentDidMount() {
    document.title = 'A Talk To Me';
    this.getSentence();
  }

  getSentence() {
    fetch('/?json=true')
      .then(res => res.json())
      .then(({ success, result }) => {
        if (success) {
          this.props.update(result);
        }
      });
  }

  render() {
    return (
      <div className="sentence">
        <blockquote className="sentence-quote">
          {this.props.sentence}
        </blockquote>
      </div>
    );
  }
}

export default Sentence;

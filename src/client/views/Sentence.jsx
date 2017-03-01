/** @jsx Inferno */
import Inferno from 'inferno';
import Component from 'inferno-component';

class Sentence extends Component {
  componentDidMount() {
    document.title = 'A Talk To Me';
  }

  getSentence() {
    fetch('/?json=true')
      .then(res => res.json())
      .then(({ success, result }) => {
        if (success) {
          console.log(1);
          console.log(result);
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
        <button className="btn sentence-btn" onClick={() => this.getSentence()}>随便说说</button>
      </div>
    );
  }
}

export default Sentence;

/** @jsx Inferno */
import Inferno from 'inferno';
import Component from 'inferno-component';

class Sentence extends Component {
  componentDidMount() {
    fetch('/?json=true')
      .then(res => res.json())
      .then(({ success, sentence }) => {
        if (success) {
          this.props.update({ sentence });
        }
      });
    document.title = 'A Talk To me';
  }

  render() {
    return (
      <main className="app-main">
        <blockquote className="sentence-quote">
          {this.props.sentence}
        </blockquote>
      </main>
    );
  }
}

export default Sentence;

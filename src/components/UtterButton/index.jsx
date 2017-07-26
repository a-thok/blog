import Inferno from 'inferno';
import Component from 'inferno-component';
import styles from './utter-button.css';

export default class UtterButton extends Component {
  constructor() {
    super();
    this.state = {
      buttonText: '朗读文章',
      utterance: null,
    };

    this.readPost = this.readPost.bind(this);
  }

  componentDidMount() {
    const text = this.props.content.replace(/<[^<>]*>/g, '');
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.addEventListener('start', () => this.setState({ buttonText: '暂停朗读' }));
    utterance.addEventListener('pause', () => this.setState({ buttonText: '继续朗读' }));
    utterance.addEventListener('resume', () => this.setState({ buttonText: '暂停朗读' }));
    utterance.addEventListener('end', () => this.setState({ buttonText: '重新朗读' }));

    // speech synthesis doesn't stop when page is reloaded, have to stop it manually
    window.addEventListener('beforeunload', () => speechSynthesis.cancel());

    this.setState({ utterance });
  }

  componentWillUnmount() {
    speechSynthesis.cancel();
  }

  readPost() {
    const { utterance } = this.state;
    if (!utterance) return;

    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    } else if (speechSynthesis.speaking) {
      speechSynthesis.pause();
    } else {
      this.setState({ buttonText: '处理中...' });
      speechSynthesis.speak(utterance);
    }
  }

  render() {
    return (
      <button
        className={styles.read}
        aria-hidden="true"
        onClick={this.readPost}
      >{this.state.buttonText}</button>
    );
  }
}

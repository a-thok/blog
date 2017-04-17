/** @jsx Inferno */
import Inferno from 'inferno';
import Component from 'inferno-component';
import { Header, Offline } from '..';
import styles from './app.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onLine: true,
    };

    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.setState({ onLine: navigator.onLine });

    window.addEventListener('online', () => this.setState({ onLine: true }));
    window.addEventListener('offline', () => this.setState({ onLine: false }));

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .addEventListener('message', (({ data }) => {
          const { success, result } = data;
          if (success) {
            this.setState({ ...this.state, ...result });
          }
        }));
    }
  }

  update(updates) {
    this.setState({ ...this.state, ...updates });
  }

  render() {
    const { children, params, ...initialState } = this.props;

    const Main = children ? Inferno.cloneVNode(children, {
      ...initialState,
      ...this.state,
      update: this.update,
    }) : null;

    return (
      <div className={styles.app}>
        {this.state.onLine ? null : <Offline />}
        <Header />
        <div className={styles.main}>{Main}</div>
      </div>
    );
  }
}

export default App;

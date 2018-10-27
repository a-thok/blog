import { Component } from 'inferno';
import { Route } from 'inferno-router';
import * as pages from './pages';
import { Header, Offline } from './components';
import styles from './app.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      onLine: true,
    };
  }

  componentDidMount() {
    this.setState({ onLine: navigator.onLine });

    window.addEventListener('online', () => this.setState({ onLine: true }));
    window.addEventListener('offline', () => this.setState({ onLine: false }));

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .addEventListener('message', (({ data: { success, result } }) => {
          if (success) {
            this.setState(state => ({ ...state, ...result }));
          }
        }));
    }
  }

  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    const { onLine } = this.state;

    return (
      <div className={styles.app}>
        {onLine ? null : <Offline />}
        <Header />
        <div className={styles.main}>
          <Route exact path="/" component={pages.Home} />
          <Route exact path="/blog" component={pages.List} />
          <Route path="/blog/:name" component={pages.Detail} />
          <Route path="/about" component={pages.About} />
        </div>
      </div>
    );
  }
}

export default App;

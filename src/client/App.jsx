/** @jsx Inferno */
import Inferno from 'inferno';
import Component from 'inferno-component';
import Header from './components/Header';
import OffLine from './components/OffLine';

class App extends Component {
  constructor() {
    super();
    this.state = {
      onLine: true,
    };

    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.setState({ ...this.state, onLine: navigator.onLine });

    window.addEventListener('online', () => {
      this.setState({ ...this.state, onLine: true });
    });

    window.addEventListener('offline', () => {
      this.setState({ ...this.state, onLine: false });
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .addEventListener('message', (({ data }) => {
          const { success, result } = data;
          if (success) {
            this.setState({ ...this.state, result });
          }
        }));
    }
  }

  update(updates) {
    this.setState({ ...this.state, ...updates });
  }

  render() {
    /* eslint-disable no-unused-vars */
    const { children, params, ...initialState } = this.props;
    /* eslint-enable */

    const Main = children ? Inferno.cloneVNode(children, {
      ...initialState,
      ...this.state,
      update: this.update,
    }) : null;

    return (
      <div className="app">
        {this.state.onLine ? null : <OffLine />}
        <Header currentRoute={this.context.router.location.pathname} />
        {Main}
      </div>
    );
  }
}

export default App;

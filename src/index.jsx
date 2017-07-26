import 'normalize.css';
import 'prism-themes/themes/prism-atom-dark.css';
import Inferno from 'inferno';
import { Router } from 'inferno-router';
import { Provider } from 'inferno-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import routes from './routes';
import store from './store';
import './style.css';

const browserHistory = createBrowserHistory();

// eslint-disable-next-line
Inferno.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>
), document.getElementById('root'));

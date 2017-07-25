import 'normalize.css';
import 'prismjs/themes/prism-okaidia.css';
import Inferno from 'inferno';
import { Router } from 'inferno-router';
import createBrowserHistory from 'history/createBrowserHistory';
import createRoutes from './createRoutes';
import './style.css';

/* eslint-disable react/no-deprecated, no-underscore-dangle */
const browserHistory = createBrowserHistory();
const routes = createRoutes(window.__INITIAL_STATE__);

Inferno.render((
  <Router history={browserHistory}>
    {routes}
  </Router>
), document.getElementById('root'));

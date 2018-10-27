import 'normalize.css';
import 'prism-themes/themes/prism-atom-dark.css';
import * as Inferno from 'inferno';
import { hydrate } from 'inferno-hydrate';
import { BrowserRouter } from 'inferno-router';
import { Provider } from 'inferno-redux';
import store from './store';
import { App } from './components';
import './style.css';

// eslint-disable-next-line
hydrate((
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));

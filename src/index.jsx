import 'normalize.css';
import 'prism-themes/themes/prism-atom-dark.css';
import { hydrate } from 'inferno-hydrate';
import { BrowserRouter } from 'inferno-router';
import { Provider } from 'inferno-redux';
import store from './store';
import App from './App';

hydrate((
  // @ts-ignore
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  // @ts-ignore
), document.getElementById('root'));

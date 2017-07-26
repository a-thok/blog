import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

/* eslint-disable no-underscore-dangle */
export default createStore(
  rootReducer,
  window.__INITIAL_STATE__,
  applyMiddleware(thunk),
);

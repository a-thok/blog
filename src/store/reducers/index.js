import { combineReducers } from 'redux';
import talk from './talk';
import list from './list';
import post from './post';

export default combineReducers({
  talk,
  list,
  post,
});

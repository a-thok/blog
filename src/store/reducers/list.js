import * as api from '../api';

const LOAD = 'posts/LOAD';
const RESET = 'posts/RESET';

export const loadList = payload => ({ type: LOAD, payload });

export const resetList = () => ({ type: RESET });

export const fetchList = (page = 1, tag = '') => (dispatch) => {
  dispatch(resetList());
  return api.fetchList(page, tag).then(payload => dispatch(loadList(payload)));
};

const initialState = {
  posts: [],
  page: 1,
  total: 0,
  tag: '',
};

export default function list(state = initialState, { type, payload }) {
  switch (type) {
    case LOAD:
      return payload;
    case RESET:
      return initialState;
    default:
      return state;
  }
}

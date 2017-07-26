import * as api from '../api';

const LOAD = 'post/LOAD';
const RESET = 'post/RESET';
const UPDATE = 'post/UPDATE';

export const loadPost = payload => ({ type: LOAD, payload });
export const resetPost = () => ({ type: RESET });
export const updatePost = payload => ({ type: UPDATE, payload });

export const fetchPost = name => dispatch =>
  api.fetchPost(name).then(payload => dispatch(loadPost(payload)));

const initialState = {
  name: '',
  title: '',
  date: '0000-00-00',
  tags: [],
  content: '',
};

export default function post(state = initialState, { type, payload }) {
  switch (type) {
    case LOAD:
      return payload;
    case RESET:
      return initialState;
    case UPDATE:
      return { ...state, ...payload };
    default:
      return state;
  }
}

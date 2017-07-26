import * as api from '../api';

const LOAD = 'talk/LOAD';

export const loadTalk = payload => ({ type: LOAD, payload });

export const fetchTalk = () => dispatch =>
  api.fetchTalk().then(payload => dispatch(loadTalk(payload)));

export default function talk(state = '', { type, payload }) {
  switch (type) {
    case LOAD:
      return payload;
    default:
      return state;
  }
}

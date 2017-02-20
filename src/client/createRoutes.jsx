/** @jsx Inferno */
import Inferno from 'inferno';
import { Route, IndexRoute } from 'inferno-router';
import App from './views/App';
import Sentence from './views/Sentence';
import PostList from './views/PostList';
import Post from './views/Post';
import About from './views/About';

const createRoutes = initialState => (
  <Route path="/" component={App} {...initialState}>
    <IndexRoute component={Sentence} />
    <Route path="blog" component={PostList} />
    <Route path="blog/:name" component={Post} />
    <Route path="about" component={About} />
  </Route>
);

export default createRoutes;

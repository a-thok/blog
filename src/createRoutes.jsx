/** @jsx Inferno */
import Inferno from 'inferno';
import { Route, IndexRoute } from 'inferno-router';
import { App } from './components';
import { Sentence, PostList, Post, About } from './pages';

const createRoutes = initialState => (
  <Route path="/" component={App} {...initialState}>
    <IndexRoute component={Sentence} />
    <Route path="blog" component={PostList} />
    <Route path="blog/:name" component={Post} />
    <Route path="about" component={About} />
  </Route>
);

export default createRoutes;

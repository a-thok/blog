import Inferno from 'inferno';
import { Route, IndexRoute } from 'inferno-router';
import { App } from '../components';
import * as pages from '../pages';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={pages.Home} />
    <Route path="blog" component={pages.List} />
    <Route path="blog/:name" component={pages.Detail} />
    <Route path="about" component={pages.About} />
  </Route>
);

export default routes;

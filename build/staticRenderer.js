/** @jsx Inferno */
/* eslint-disable import/no-extraneous-dependencies */
import hook from 'css-modules-require-hook';
import Inferno from 'inferno';
import InfernoServer from 'inferno-server';
import { RouterContext, match } from 'inferno-router';
import template from './template';

hook({
  extensions: ['.css'],
  camelCase: true,
  generateScopedName: '[name]__[local]',
});

const createRoutes = require('../src/createRoutes').default;

export default function staticRenderer({ state, title, url }) {
  const routes = createRoutes(state);
  const renderProps = match(routes, url);
  const staticString = InfernoServer.renderToString(<RouterContext {...renderProps} />);
  return template({ title, state, staticString });
}

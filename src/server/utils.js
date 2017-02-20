/** @jsx Inferno */
/* eslint-disable react/jsx-filename-extension */
import marked from 'marked';
import Prism from 'prismjs';
import Inferno from 'inferno';
import InfernoServer from 'inferno-server';
import { RouterContext, match } from 'inferno-router';
import createRoutes from '../client/createRoutes';
import template from './template';

marked.setOptions({
  highlight(code, lang) {
    return Prism.highlight(code, Prism.languages[lang]);
  },
});

export const markPost = post => ({
  ...post,
  content: marked(post.content)
    .replace(
      /<pre><code class="lang-(\w+)">/g,
      '<pre class="language-$1" data-lang="$1"><code class="language-$1">'
    ),
});

const renderPage = (req, res, title, data) => {
  const initialState = Object.assign({
    sentence: '',
    currentPage: 1,
    totalPages: 1,
    tag: '',
    posts: [],
    post: {},
  }, data);


  const routes = createRoutes(initialState);
  const renderProps = match(routes, req.originalUrl);

  if (renderProps.redirect) {
    return res.redirect(renderProps.redirect);
  }
  const content = InfernoServer.renderToString(Inferno.cloneVNode(<RouterContext />, renderProps));

  // content is too large and duplicated
  if (initialState.post.content) {
    delete initialState.post.content;
  }
  return res.send(template(title, content, initialState, req.isIE));
};

export const handleRequest = (req, res, title, data) => {
  const { json } = req.query;
  if (json) {
    return res.status(200).send(Object.assign({
      success: true,
    }, data));
  }

  return renderPage(req, res, title, data);
};

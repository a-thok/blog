import Inferno from 'inferno';
import InfernoServer from 'inferno-server';
import { RouterContext, match } from 'inferno-router';
import createRoutes from '../../../client/createRoutes';

/* eslint-disable no-unused-vars */
const template = ({ nonce, title, app, initialState, isIE }) =>
(`<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="阿托的个人博客，记录技术生涯的成长与日常生活的琐碎">
  <meta name="author" name="阿托">
  <link href="https://fonts.googleapis.com/css?family=Raleway:400,400i,700,700i" rel="stylesheet">
  <link href="/style.css" rel="stylesheet">
  <!--[if lt IE 10]>
  <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <link href="/ie.css" rel="stylesheet">
  <![endif]-->
  <!--[if lt IE 9]>
  <link href="/ie8.css" rel="stylesheet">
  <![endif]-->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker
          .register('/sw.js')
          .catch(function (error) { console.log(error); });
      });
    }
  </script>
  <script>
    var __INITIAL_STATE__ = ${JSON.stringify(initialState)}
  </script>
  <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Object.assign,Promise,fetch,Map,WeakMap" defer></script>
  <script src="/app.js" defer></script>${isIE ? `\n  <script src="//cdn.bootcss.com/svg4everybody/2.1.4/svg4everybody.legacy.min.js"></script>
  <script> svg4everybody(); </script>` : ''}
</head>
<body>
  <div id="root">${app}</div>
</body>
</html>`);

const defaultState = {
  sentence: '',
  currentPage: 1,
  totalPages: 1,
  tag: '',
  posts: [],
  post: {},
};

const renderPage = (req, res, state = {}) => {
  const initialState = { ...defaultState, ...state };
  const routes = createRoutes(initialState);

  const renderProps = match(routes, req.originalUrl);

  if (renderProps.redirect) {
    return res.redirect(renderProps.redirect);
  }

  const app = InfernoServer.renderToString(Inferno.cloneVNode(<RouterContext />, renderProps));

  // content is too large and duplicated,
  // it can be extracted from the DOM however
  if (initialState.post.content) {
    delete initialState.post.content;
  }

  return res.send(template({
    nonce: res.locals.nonce,
    title: res.locals.title,
    app,
    initialState,
    isIE: res.locals.isIE,
  }));
};

export default renderPage;

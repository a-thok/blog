const template = (title, content, state, isIE) =>
(`<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="阿托的个人博客，记录技术生涯的成长与日常生活的琐碎">
  <meta name="author" name="阿托">
  <!--[if lt IE 9]>
    <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <![endif]-->
  <!--[if lt IE 10]>
    <script> document.documentElement.className ='ie'; </script>
  <![endif]-->
  <link href="https://fonts.googleapis.com/css?family=Raleway:400,400i,700,700i" rel="stylesheet">
  <link href="/style.css" rel="stylesheet">
  <script>var __INITIAL_STATE__ = ${JSON.stringify(state)}</script>
  <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Object.assign,Promise,fetch,Map,WeakMap" defer></script>
  <script src="/app.js" defer></script>${isIE ? `\n<script src="//cdn.bootcss.com/svg4everybody/2.1.4/svg4everybody.legacy.min.js"></script>
  <script> svg4everybody(); </script>` : ''}
</head>
<body>
  <div id="root">${content}</div>
</body>
</html>`);

export default template;

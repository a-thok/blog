const isProd = process.env.NODE_ENV === 'production';

const template = ({ title, state, staticString }) => (
`<!DOCTYPE html>
<!--[if IE 8]><html lang="cmn-hans" data-ie="8"><![endif]-->
<!--[if IE 9]><html lang="cmn-hans" data-ie="9"><![endif]-->
<html lang="cmn-hans">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="阿托的个人博客，记录技术生涯的成长与日常生活的琐碎">
  <meta name="author" content="阿托">
  <link rel="manifest" href="/manifest.json">
  <link href="https://fonts.googleapis.com/css?family=Raleway:400,400i,700,700i" rel="stylesheet">
  ${isProd ? '<link href="/style.css" rel="stylesheet">' : ''}
  <!--[if lt IE 9]>
  <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <![endif]-->${isProd ? `\n<script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js');
      });
    }
  </script>` : ''}
  <script>
    var __INITIAL_STATE__ = ${JSON.stringify(state)}
  </script>
  <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Object.assign,Promise,fetch,Map,WeakMap,Set" defer></script>
  <script src="/app.js" defer></script>
</head>
<body>
  <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <symbol id="icon-arrow-right" viewBox="0 0 24 24">
        <title>arrow-right</title>
        <path d="M14 4q0.422 0 0.711 0.289l7 7q0.289 0.289 0.289 0.711t-0.289 0.711l-7 7q-0.289 0.289-0.711 0.289-0.43 0-0.715-0.285t-0.285-0.715q0-0.422 0.289-0.711l5.297-5.289h-15.586q-0.414 0-0.707-0.293t-0.293-0.707 0.293-0.707 0.707-0.293h15.586l-5.297-5.289q-0.289-0.289-0.289-0.711 0-0.43 0.285-0.715t0.715-0.285z"></path>
      </symbol>
      <symbol id="icon-arrow-left" viewBox="0 0 24 24">
        <title>arrow-left</title>
        <path d="M10 4q0.414 0 0.707 0.293t0.293 0.707q0 0.422-0.297 0.711l-5.289 5.289h15.586q0.414 0 0.707 0.293t0.293 0.707-0.293 0.707-0.707 0.293h-15.586l5.289 5.289q0.297 0.289 0.297 0.711 0 0.414-0.293 0.707t-0.707 0.293q-0.422 0-0.711-0.289l-7-7q-0.289-0.305-0.289-0.711t0.289-0.711l7-7q0.297-0.289 0.711-0.289z"></path>
      </symbol>
      <symbol id="icon-calendar" viewBox="0 0 26 28">
        <title>calendar</title>
        <path d="M2 26h22v-16h-22v16zM8 7v-4.5c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v4.5c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM20 7v-4.5c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v4.5c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM26 6v20c0 1.094-0.906 2-2 2h-22c-1.094 0-2-0.906-2-2v-20c0-1.094 0.906-2 2-2h2v-1.5c0-1.375 1.125-2.5 2.5-2.5h1c1.375 0 2.5 1.125 2.5 2.5v1.5h6v-1.5c0-1.375 1.125-2.5 2.5-2.5h1c1.375 0 2.5 1.125 2.5 2.5v1.5h2c1.094 0 2 0.906 2 2z"></path>
      </symbol>
      <symbol id="icon-tag" viewBox="0 0 32 32">
        <title>tag</title>
        <path d="M31.391 13.883l-5-8c-0.73-1.169-2.012-1.88-3.391-1.88h-19c-2.209 0-4 1.791-4 4v16c0 2.209 1.791 4 4 4h19c1.379 0 2.66-0.711 3.391-1.881l5-8c0.812-1.295 0.812-2.942 0-4.239zM29.695 17.062l-5 8.002c-0.367 0.588-1.002 0.939-1.695 0.939h-19c-1.103 0-2-0.898-2-2v-16c0-1.103 0.897-2 2-2h19c0.693 0 1.328 0.352 1.695 0.939l5 8c0.403 0.645 0.403 1.477 0 2.12zM23 13.003c-1.658 0-3 1.343-3 3s1.342 3 3 3c1.656 0 3-1.344 3-3 0-1.657-1.344-3-3-3zM23 18.004c-1.105 0-2-0.896-2-2s0.895-2 2-2c1.104 0 2 0.896 2 2s-0.896 2-2 2z"></path>
      </symbol>
      <symbol id="icon-spinner" viewBox="0 0 32 32">
        <title>spinner</title>
        <path d="M32 16c-0.040-2.089-0.493-4.172-1.331-6.077-0.834-1.906-2.046-3.633-3.533-5.060-1.486-1.428-3.248-2.557-5.156-3.302-1.906-0.748-3.956-1.105-5.981-1.061-2.025 0.040-4.042 0.48-5.885 1.292-1.845 0.809-3.517 1.983-4.898 3.424s-2.474 3.147-3.193 4.994c-0.722 1.846-1.067 3.829-1.023 5.79 0.040 1.961 0.468 3.911 1.254 5.694 0.784 1.784 1.921 3.401 3.316 4.736 1.394 1.336 3.046 2.391 4.832 3.085 1.785 0.697 3.701 1.028 5.598 0.985 1.897-0.040 3.78-0.455 5.502-1.216 1.723-0.759 3.285-1.859 4.574-3.208 1.29-1.348 2.308-2.945 2.977-4.67 0.407-1.046 0.684-2.137 0.829-3.244 0.039 0.002 0.078 0.004 0.118 0.004 1.105 0 2-0.895 2-2 0-0.056-0.003-0.112-0.007-0.167h0.007zM28.822 21.311c-0.733 1.663-1.796 3.169-3.099 4.412s-2.844 2.225-4.508 2.868c-1.663 0.646-3.447 0.952-5.215 0.909-1.769-0.041-3.519-0.429-5.119-1.14-1.602-0.708-3.053-1.734-4.25-2.991s-2.141-2.743-2.76-4.346c-0.621-1.603-0.913-3.319-0.871-5.024 0.041-1.705 0.417-3.388 1.102-4.928 0.683-1.541 1.672-2.937 2.883-4.088s2.642-2.058 4.184-2.652c1.542-0.596 3.192-0.875 4.832-0.833 1.641 0.041 3.257 0.404 4.736 1.064 1.48 0.658 2.82 1.609 3.926 2.774s1.975 2.54 2.543 4.021c0.57 1.481 0.837 3.064 0.794 4.641h0.007c-0.005 0.055-0.007 0.11-0.007 0.167 0 1.032 0.781 1.88 1.784 1.988-0.195 1.088-0.517 2.151-0.962 3.156z"></path>
      </symbol>
    </defs>
  </svg>
  <div id="root">${staticString}</div>
</body>
</html>`
);

export default template;

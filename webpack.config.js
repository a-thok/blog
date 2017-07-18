module.exports = (process.env.NODE_ENV === 'production')
  ? require('./build/webpack.prod')
  : require('./build/webpack.dev');

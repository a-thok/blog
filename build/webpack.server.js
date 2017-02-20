const path = require('path');

module.exports = {
  target: 'node',

  entry: './src/server',

  output: {
    path: path.join(__dirname, '../'),
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: 'node_modules',
      },
    ],
  },

  externals: /^[a-z\-0-9]+$/,

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  stats: 'none',
};

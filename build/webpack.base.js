const path = require('path');

module.exports = {
  entry: {
    app: './src/index.jsx',
    sw: './src/sw.js',
  },

  output: {
    path: path.resolve('dist'),
    publicPath: '/',
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

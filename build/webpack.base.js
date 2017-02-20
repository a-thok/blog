/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const postcssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const postcssVariables = require('postcss-css-variables');
const pixrem = require('pixrem');
const colorFunction = require('postcss-color-function');

module.exports = {
  entry: {
    app: './src/client',
    sw: './src/client/sw.js',
  },

  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['buble-loader', 'babel-loader'],
        exclude: 'node_modules',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          postcssImport(),
          autoprefixer({
            grid: false,
          }),
          postcssVariables(),
          pixrem(),
          colorFunction(),
        ],
        context: __dirname,
      },
    }),
  ],
};

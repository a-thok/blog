/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const cssnext = require('postcss-cssnext');

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

  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          cssnext({
            features: {
              autoprefixer: {
                grid: false,
              },
              customProperties: {
                variables: {
                  theme: '#68c144',
                  emphasis: '#f97c7c',
                  grey: '#bbb',
                },
              },
              calc: false,
            },
          }),
        ],
        context: __dirname,
      },
    }),
  ],
};

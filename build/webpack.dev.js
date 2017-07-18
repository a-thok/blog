/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const baseConfig = require('./webpack.base');
const cssLoader = require('./cssLoader');

module.exports = Object.assign({}, baseConfig, {
  module: {
    rules: [
      ...baseConfig.module.rules,

      {
        test: /\.css$/,
        use: ['style-loader', cssLoader, 'postcss-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
        include: /node_modules/,
      },
    ],
  },

  devtool: 'cheap-module-eval-source-map',

  devServer: {
    host: '0.0.0.0',
    proxy: {
      '/': {
        target: 'http://localhost:4000',
        secure: false,
      },
      '/posts': {
        target: 'http://localhost:4000',
        secure: false,
      },
      '/post/*': {
        target: 'http://localhost:4000',
        secure: false,
      },
    },
    stats: 'minimal',
  },

  plugins: [
    ...baseConfig.plugins,

    new webpack.NoEmitOnErrorsPlugin(),
  ],
});

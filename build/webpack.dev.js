/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const baseConfig = require('./webpack.base');
const cssLoader = require('./cssLoader');

module.exports = Object.assign({}, baseConfig, {
  entry: {
    app: [
      'webpack-hot-middleware/client?reload=true',
      './src/index.jsx',
    ],
  },

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

  plugins: [
    ...baseConfig.plugins,

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});

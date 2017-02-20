/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.base');
const serverConfig = require('./webpack.server');

module.exports = [Object.assign({}, baseConfig, {
  module: {
    rules: [
      ...baseConfig.module.rules,

      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true,
              importLoaders: 1,
            },
          }, 'postcss-loader'],
        }),
      },
    ],
  },

  devtool: 'source-map',

  plugins: [
    ...baseConfig.plugins,

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),

    new ExtractTextPlugin('style.css'),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true,
    }),
  ],
}), serverConfig];

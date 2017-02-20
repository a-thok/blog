/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const baseConfig = require('./webpack.base');

module.exports = Object.assign({}, baseConfig, {
  module: {
    rules: [
      ...baseConfig.module.rules,

      {
        test: /\.css$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            importLoaders: 1,
          },
        }, 'postcss-loader'],
      },
    ],
  },

  devtool: 'cheap-eval-source-map',

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
    stats: {
      assets: false,
      chunks: false,
      hash: false,
      version: false,
    },
  },

  plugins: [
    ...baseConfig.plugins,

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
});

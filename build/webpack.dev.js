const webpack = require('webpack');
const baseConfig = require('./webpack.base');

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
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
              module: true,
              camelCase: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
          'postcss-loader',
        ],
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

  devtool: '#eval-source-map',

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"devlopment"',
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});

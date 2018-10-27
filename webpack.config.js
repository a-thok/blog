const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, { mode }) => {
  const isProd = mode === 'production';

  return {
    mode,

    entry: isProd ? {
      app: './src/index.jsx',
      sw: './src/sw.js',
    } : {
      app: [
        'webpack-hot-middleware/client?reload=true',
        './src/index.jsx',
      ],
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

        {
          test: /\.css$/,
          use: [
            {
              loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                minimize: isProd,
                sourceMap: true,
                importLoaders: 1,
                modules: true,
                camelCase: true,
                localIdentName: isProd ? '[local][hash:base64:5]' : '[name]__[local]--[hash:base64:5]',
              },
            },
            'postcss-loader',
          ],
          exclude: /node_modules/,
        },

        {
          test: /\.css$/,
          use: [
            {
              loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                minimize: isProd,
                sourceMap: true,
              },
            },
            'postcss-loader',
          ],
          include: /node_modules/,
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx'],
      alias: isProd ? {} : {
        inferno: `${__dirname}/node_modules/inferno/dist/index.dev.esm.js`,
      },
    },

    devtool: isProd ? 'source-map' : 'eval-source-map',

    plugins: [
      ...(isProd ? [
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css',
        }),
      ] : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
      ]),
    ],
  };
};

module.exports = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    minimize: true,
    importLoaders: 1,
    module: true,
    camelCase: true,
    localIdentName: '[name]__[local]',
  },
};


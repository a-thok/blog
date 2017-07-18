// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: {
    // to edit target browsers: use "browserlist" field in package.json
    'postcss-cssnext': {
      features: {
        autoprefixer: {
          grid: false,
        },
        customProperties: {
          variables: {
            theme: '#68c144',
            grey: '#bbb',
          },
        },
        calc: false,
      },
    },
  }
}

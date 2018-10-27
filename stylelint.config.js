module.exports = {
  extends: 'stylelint-config-standard',
  ignoreFiles: ['./dist/*.css'],
  rules: {
    'no-descending-specificity': null,
    'property-no-unknown': [true, {
      ignoreProperties: [
        'composes',
      ],
    }],
  },
};

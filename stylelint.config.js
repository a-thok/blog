module.exports = {
  extends: 'stylelint-config-standard',
  ignoreFiles: ['./dist/*.css'],
  rules: {
    'property-no-unknown': [true, {
      ignoreProperties: [
        'composes',
      ],
    }],
  },
};

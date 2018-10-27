require('@babel/register')({ // eslint-disable-line
  presets: ['@babel/env'],
});

require('./generator');

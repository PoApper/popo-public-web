const { i18n } = require('./next-i18next.config');

module.exports = {
  output: 'standalone',
  outputFileTracingRoot: __dirname,
  i18n,
};

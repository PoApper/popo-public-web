module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@next/next/recommended',
    'next/core-web-vitals',
  ],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};

module.exports = {
  root: true,
  extends: [
    'airbnb-base',
  ],
  env: {
    browser: true,
    node: true,
  },
  plugins: [],
  rules: {
    'import/order': 'off',
    'import/extensions': 'off',

    'max-len': ['error', { 'code': 150 }],
    'no-shadow': 0,
    'func-names': 0,

    'no-unused-expressions': ['error', { 'allowShortCircuit': true }],
    'no-restricted-properties': 'off',
    'array-callback-return': 'off',
    'prefer-destructuring': 'off',

    'import/named': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'no-plusplus': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,

    'class-methods-use-this': 0,

    // allow global require
    'linebreak-style': 0,
    'indent': 0,
    'global-require': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'no-prototype-builtins': 0,
    'no-underscore-dangle': 0,
    'implicit-arrow-linebreak': 0,
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  overrides: [
    {
      files: ['**/*.js?(x)'],
    },
  ],
  globals: {
  }
};

/* eslint-env node */
module.exports = {
  env: {
    node: true,
    es6: true,
    'jest/globals': true,
    'cypress/globals': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'jest', 'cypress', 'prettier'],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'no-tabs': ['error', { allowIndentationTabs: true }],
    'max-len': [
      'error',
      {
        code: 90,
        tabWidth: 4,
        ignoreUrls: true,
      },
    ],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    eqeqeq: 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
    'no-console': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}

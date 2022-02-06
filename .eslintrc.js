module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/jest',
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/consistent-type-imports': [
      1,
      { prefer: 'type-imports' },
    ],
    'no-console': 'warn',
    'import/no-unresolved': 0,
    'import/order': [
      2,
      {
        alphabetize: { order: 'asc' },
      },
    ],
    'react/jsx-curly-brace-presence': [
      1,
      { props: 'never', children: 'never' },
    ],
    'react/react-in-jsx-scope': 0,
  },
}

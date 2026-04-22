/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    node: true,
  },
  extends: [
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'react-app',
    'react-app/jest',
  ],
  plugins: ['@grncdr/react-hooks'],
  root: true,
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prefer-const': 'error',
    'no-empty': 'off',
    'prettier/prettier': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_', ignoreRestSiblings: true }],
    'no-async-promise-executor': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/alt-text': 'off',
    'no-extend-native': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    // TODO: remove this in the future
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@grncdr/react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useDebounceEffect|useMemoRef|useCtrl$)',
        staticHooks: {
          useStateRef: true,
          useMemoRef: true,
          useGeneratedRef: true,
          useQuery: [false, true],
          useDebounceFn: true,
          useRerender: true,
        },
      },
    ],
  },
};

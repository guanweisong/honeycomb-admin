module.exports = {
  extends: [
    require.resolve('@umijs/fabric/dist/eslint'),
    'plugin:jsx-control-statements/recommended',
  ],
  plugins: ['prettier', 'jsx-control-statements'],
  rules: {
    'prettier/prettier': 'warn',
    'no-underscore-dangle': 'off',
    'react/jsx-no-undef': 'warn',
  },
  ecmaFeatures: {
    jsx: true,
  },
}

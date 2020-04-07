module.exports = {
  extends: [
    require.resolve('@umijs/fabric/dist/eslint'),
    'plugin:jsx-control-statements/recommended',
  ],
  plugins: ['prettier', 'jsx-control-statements'],
  rules: {
    'prettier/prettier': 'warn',
    'no-underscore-dangle': 'off',
  },
  ecmaFeatures: {
    jsx: true,
  },
}

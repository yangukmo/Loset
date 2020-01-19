module.exports = {
  extends: [
    'plugin:vue/base',
    '@vue/typescript',
  ],
  rules: {
    quotes: ['error', 'single'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}

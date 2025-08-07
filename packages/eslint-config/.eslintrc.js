// ESLint config local para lintar os arquivos do próprio pacote de configuração

const baseConfig = require('./library.js')

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...baseConfig,
  root: true,
  ignorePatterns: [],
  overrides: [
    {
      files: ['*.js'],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'script',
      },
    },
  ],
}

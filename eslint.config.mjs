import { zlAsicaTsConfig } from 'eslint-config-zl-asica'

export default [
  ...zlAsicaTsConfig,
  {
    ignores: ['prettier.config.cjs'],
  },
  {
    rules: {
      'unicorn/prefer-string-replace-all': 'off',
    },
  },
]

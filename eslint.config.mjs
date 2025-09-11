import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginJest from 'eslint-plugin-jest'
import globals from 'globals'

export default [
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  pluginReactHooks.configs['recommended-latest'],
  pluginPrettierRecommended,
  {
    plugins: {
      react: pluginReact,
      jest: pluginJest,
    },

    languageOptions: {
      globals: { ...globals.browser, ...pluginJest.environments.globals.globals },
      ecmaVersion: 'latest',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'react/prop-types': 'off',
    },
  },
]

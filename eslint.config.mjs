import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginJest from 'eslint-plugin-jest'
import globals from 'globals'

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  pluginReactHooks.configs.flat.recommended,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 'off',
    },
  },
  {
    files: ['**/*.{spec,test}.{js,jsx}'],
    ...pluginJest.configs['flat/recommended'],
    languageOptions: {
      globals: {
        ...pluginJest.environments.globals.globals,
      },
    },
  },

  pluginPrettierRecommended,
]

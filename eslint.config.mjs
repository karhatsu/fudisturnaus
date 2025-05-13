import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginJest from 'eslint-plugin-jest'
import globals from 'globals'

export default [
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  pluginReactHooks.configs['recommended-latest'],
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
      indent: ['error', 2, {
        SwitchCase: 1,
      }],

      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],

      'comma-dangle': ['warn', {
        objects: 'always-multiline',
        functions: 'ignore',
      }],

      'no-trailing-spaces': 1,

      'max-len': [1, {
        code: 150,
      }],

      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': 'error',
    },
  }
]

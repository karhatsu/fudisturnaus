module.exports = function(api) {
  api.cache(true)

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          forceAllTransforms: true,
          targets: {
            browsers: '> 1%',
          },
        }
      ],
      '@babel/preset-react'
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-object-rest-spread',
      [
        '@babel/plugin-proposal-class-properties',
        {
          'spec': true,
        }
      ]
    ],
    env: {
      test: {
        presets: [
          '@babel/preset-env'
        ],
      },
    },
  }
}

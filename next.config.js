const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  target: process.env.NETLIFY ? 'serverless' : 'server',

  webpack(config, { defaultLoaders }) {
    config.module.rules.push({
      test: /\.jsx/,
      use: [defaultLoaders.babel],
      include: [/node_modules\/heroicons/],
    })

    return config
  },

  i18n: {
    localeDetection: false,
  },

  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    runtimeCaching,
  },
})

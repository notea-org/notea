const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const path = require('path')

module.exports = withPWA({
  future: {
    /**
     * FIXME
     * https://github.com/netlify/netlify-plugin-nextjs/issues/209
     */
    webpack5: process.env.NETLIFY ? false : true,
  },

  target: process.env.NETLIFY ? 'serverless' : 'server',

  webpack(config, { defaultLoaders }) {
    config.module.rules.push({
      test: /\.jsx/,
      use: [defaultLoaders.babel],
      include: [path.resolve(__dirname, 'node_modules/heroicons')],
    })

    return config
  },

  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    runtimeCaching,
  },
})

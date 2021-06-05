const withPWA = require('next-pwa')

module.exports = withPWA({
  future: {
    /**
     * FIXME
     * https://github.com/netlify/netlify-plugin-nextjs/issues/209
     */
    webpack5: process.env.NETLIFY ? false : true,
  },

  target: process.env.NETLIFY ? 'serverless' : 'server',

  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
  },
})

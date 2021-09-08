const withPWA = require('next-pwa')
const cache = require('./scripts/cache')

module.exports = withPWA({
  target: process.env.NETLIFY ? 'serverless' : 'server',

  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    runtimeCaching: cache
  },
})

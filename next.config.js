const withPWA = require('next-pwa')

module.exports = withPWA({
  target: process.env.NETLIFY ? 'serverless' : 'server',

  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
  },
})

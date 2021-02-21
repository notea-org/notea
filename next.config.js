const withTM = require('next-transpile-modules')([
  'heroicons/react/outline',
  '@notea/shared',
  '@notea/store',
])
module.exports = withTM({
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/page/welcome',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/page',
        destination: '/',
        permanent: true,
      },
    ]
  },
})

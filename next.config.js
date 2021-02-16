const withTM = require('next-transpile-modules')([
  'heroicons/react/outline',
  '@notea/shared',
  '@notea/store',
])
module.exports = withTM({
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

const WorkerPlugin = require('worker-plugin')

module.exports = {
  rewrites() {
    return [
      {
        source: '/',
        destination: '/note/welcome',
      },
    ]
  },
  redirects() {
    return [
      {
        source: '/note',
        destination: '/',
        permanent: true,
      },
    ]
  },
  webpack(config, { defaultLoaders, isServer }) {
    config.module.rules.push({
      test: /\.jsx/,
      use: [defaultLoaders.babel],
      include: [/node_modules\/heroicons/],
    })

    if (!isServer) {
      config.plugins.push(
        new WorkerPlugin({
          // use "self" as the global object when receiving hot updates.
          globalObject: 'self',
        })
      )
    }

    return config
  },
}

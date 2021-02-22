module.exports = {
  rewrites() {
    return [
      {
        source: '/',
        destination: '/page/welcome',
      },
    ]
  },
  redirects() {
    return [
      {
        source: '/page',
        destination: '/',
        permanent: true,
      },
    ]
  },
  webpack(config, { defaultLoaders }) {
    config.module.rules.push({
      test: /\.jsx/,
      use: [defaultLoaders.babel],
      include: [/node_modules\/heroicons/],
    })

    return config
  },
}

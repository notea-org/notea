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
  webpack(config, { defaultLoaders }) {
    config.module.rules.push({
      test: /\.jsx/,
      use: [defaultLoaders.babel],
      include: [/node_modules\/heroicons/],
    })

    return config
  },
}

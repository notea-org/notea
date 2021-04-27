const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  future: {
    webpack5: true,
  },

  assetPrefix: isProd
    ? 'https://cdn.statically.io/gh/QingWei-Li/notea/gh-pages/'
    : '',
}

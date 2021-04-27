const isProd = process.env.NODE_ENV === 'production'
const cdnConfig = require('./cdn.json')

module.exports = {
  future: {
    webpack5: true,
  },

  assetPrefix: isProd ? cdnConfig.URL : '',
}

const withPWA = require('next-pwa');
const cache = require('./scripts/cache');

const base = withPWA({
    target: process.env.NETLIFY ? 'serverless' : 'server',

    pwa: {
        disable: process.env.NODE_ENV === 'development',
        dest: 'public',
        runtimeCaching: cache
    }
})

const wp = base.webpack;
module.exports = Object.assign(base, {
    webpack(config, options) {
        // In case it's required to change the webpack config
        return wp(config, options);
    }
});

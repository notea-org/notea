const nextPWA = require('next-pwa');
const cache = require('./scripts/cache');

const developmentEnv = process.env.NODE_ENV === 'development';
const withPWA = nextPWA({
    // target: process.env.NETLIFY ? 'serverless' : 'server',
    // mode: process.env.NODE_ENV ?? 'development',
    disable: developmentEnv,
    dest: 'public',
    runtimeCaching: cache,
});

module.exports = withPWA({
    swcMinify: true
});

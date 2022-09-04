require('dotenv').config({ path: '.env.test' });

module.exports = {
    collectCoverageFrom: ['**/*.{ts}', '!**/*.d.ts', '!**/node_modules/**'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
    testEnvironment: 'jsdom',
    transform: {
        /* Use babel-jest to transpile tests with the next/babel preset
         https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
        '^.+\\.(ts)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    transformIgnorePatterns: [
        '/node_modules/',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
    moduleNameMapper: {
        'pages/(.*)$': '<rootDir>/pages/$1',
        'libs/(.*)$': '<rootDir>/libs/$1',
        'tests/(.*)$': '<rootDir>/tests/$1',
    },
};

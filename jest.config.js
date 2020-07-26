const base = require('./jestBase.config');

module.exports = {
    ...base,
    projects: [
        '<rootDir>/packages/ui-schema/jest.config.js',
    ],
    coverageDirectory: '<rootDir>/coverage',
};

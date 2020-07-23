const pack = require('./package.json');
const base = require('../../jestBase.config');

module.exports = {
    ...base,
    roots: [
        '<rootDir>/src',
        '<rootDir>/tests',
    ],
    name: pack.name,
    displayName: pack.name
};

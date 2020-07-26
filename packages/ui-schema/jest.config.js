const pack = require('./package.json');
const base = require('../../jestBase.config');

module.exports = {
    ...base,
    roots: [
        '<rootDir>/src',
        '<rootDir>/tests',
    ],
    moduleNameMapper: {
        "^@ui-schema/ui-schema(.*)$": "<rootDir>/src$1",
    },
    name: pack.name,
    displayName: pack.name
};

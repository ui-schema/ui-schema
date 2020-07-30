module.exports = {
    testRegex: '(/(tests|src)/.*.(test|spec)).(jsx?|tsx?)$',
    transformIgnorePatterns: [
        "node_modules/?!(@ui-schema)"
    ],
    //transformIgnorePatterns: ['node_modules/(?!(react-apollo/test-links(.js)?))'],
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node'
    ],
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        '(tests/.*.mock).(jsx?|tsx?)$'
    ],
    verbose: true,
};

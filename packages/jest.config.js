const packages = ['ui-schema', 'ds-bootstrap', 'ds-material', 'material-code', 'material-color', 'material-pickers', 'material-richtext'];

const testMatches = []
const testMatchesLint = []

packages.forEach(pkg => {
    testMatches.push(...[
        '<rootDir>/' + pkg + '/src/**/*.(test|spec).(js|ts|tsx)',
        '<rootDir>/' + pkg + '/tests/**/*.(test|spec).(js|ts|tsx)',
    ])
    testMatchesLint.push(...[
        '<rootDir>/' + pkg + '/src/**/*.(test|spec|d).(js|ts|tsx)',
        '<rootDir>/' + pkg + '/tests/**/*.(test|spec|d).(js|ts|tsx)',
    ])
})

const base = {
    transformIgnorePatterns: [
        'node_modules/?!(@ui-schema)'
    ],
    moduleNameMapper: {
        '^@ui-schema/ui-schema(.*)$': '<rootDir>/ui-schema/src$1',
        '^@ui-schema/ds-bootstrap(.*)$': '<rootDir>/ds-bootstrap/src$1',
    },
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

module.exports = {
    ...base,
    projects: [
        {
            displayName: 'test',
            ...base,
            testMatch: testMatches,
        },
        {
            displayName: 'lint',
            runner: 'jest-runner-eslint',
            ...base,
            testMatch: testMatchesLint,
        },
    ],
    coverageDirectory: '<rootDir>/../coverage',
};

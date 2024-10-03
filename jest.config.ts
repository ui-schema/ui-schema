import type { Config } from '@jest/types'

const packages: string[] = ['ui-schema', 'ui-schema-pro', 'ds-bootstrap', 'ds-material', 'material-dnd', 'material-pickers', 'material-slate', 'kit-dnd']

const testMatchesLint: string[] = []

packages.forEach(pkg => {
    testMatchesLint.push(...[
        '<rootDir>/packages/' + pkg + '/src/**/*.(js|ts|tsx)',
        '<rootDir>/packages/' + pkg + '/tests/**/*.(test|spec|d).(js|ts|tsx)',
    ])
})

const base: Partial<Config.InitialOptions> = {
    cacheDirectory: '<rootDir>/node_modules/.cache/jest-tmp',
    transformIgnorePatterns: [
        'node_modules/?!(@ui-schema)',
    ],
    transform: {
        '^.+.[jt]sx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@ui-schema/ui-schema(.*)$': '<rootDir>/packages/ui-schema/src$1',
        '^@ui-schema/pro(.*)$': '<rootDir>/packages/ui-schema-pro/src$1',
        '^@ui-schema/ds-bootstrap(.*)$': '<rootDir>/packages/ds-bootstrap/src$1',
        '^@ui-schema/ds-material(.*)$': '<rootDir>/packages/ds-material/src$1',
        '^@ui-schema/kit-dnd(.*)$': '<rootDir>/packages/kit-dnd/src$1',
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    coveragePathIgnorePatterns: [
        '(tests/.*.mock).(jsx?|tsx?|ts?|js?)$',
    ],
}

const config: Config.InitialOptions = {
    ...base,
    collectCoverage: true,
    verbose: true,
    // todo: check why `transformIgnorePatterns`, combined with multi-projects/lerna 0.5.3 upgrade, throws `Reentrant plugin detected trying to load ....babel-plugin-jest-hoist/build/index.js`
    /*transformIgnorePatterns: [
        'node_modules/?!(@ui-schema)',
    ],*/
    projects: [
        ...packages.map(pkg => ({
            displayName: 'test-' + pkg,
            ...base,
            moduleDirectories: ['node_modules', '<rootDir>/packages/' + pkg + '/node_modules'],
            //moduleDirectories: ['node_modules', '<rootDir>/packages/ui-schema/node_modules', '<rootDir>/packages/ds-material/node_modules'],
            // todo: check why `transformIgnorePatterns`, combined with multi-projects/lerna 0.5.3 upgrade, throws `TypeError: /node_modules/jest-runner-eslint/build/runner/index.js: node_modules/@ampproject/remapping/dist/remapping.umd.js: _remapping(...) is not a function`
            /*transformIgnorePatterns: [
                'node_modules/?!(@ui-schema)',
            ],*/
            //testEnvironmentOptions: {},
            testMatch: [
                '<rootDir>/packages/' + pkg + '/src/**/*.(test|spec).(js|ts|tsx)',
                '<rootDir>/packages/' + pkg + '/tests/**/*.(test|spec).(js|ts|tsx)',
            ],
        })),
        {
            displayName: 'lint',
            runner: 'jest-runner-eslint',
            ...base,
            testMatch: testMatchesLint,
        },
    ],
    coverageDirectory: '<rootDir>/coverage',
}

export default config

import type { Config } from '@jest/types'

// helpful jest commands:
// npm run test -- --selectProjects=test-uis-react --maxWorkers=4
// npm run test -- --selectProjects=test-uis-react --testPathPattern=WidgetEngine --maxWorkers=4

const packages: string[] = [
    'uis-system', 'uis-react',
    'uis-react-json-schema', 'uis-pro',
    'uis-json-pointer', 'uis-json-schema',
    'ds-bootstrap', 'ds-material',
    'material-dnd', 'material-pickers', 'material-slate',
    'kit-dnd',
]

const testMatchesLint: string[] = []

packages.forEach(pkg => {
    testMatchesLint.push(...[
        '<rootDir>/' + pkg + '/src/**/*.(js|ts|tsx)',
        //'<rootDir>/' + pkg + '/tests/**/*.(test|spec|d).(js|ts|tsx)',
    ])
})
const base: Partial<Config.InitialOptions> = {
    preset: 'ts-jest/presets/default-esm',
    // preset: 'ts-jest',
    // preset: 'jest-preset.js',
    transformIgnorePatterns: [
        'node_modules/?!(@ui-schema)',
        // 'node_modules/(?!(.*@ui-schema.*|.*node_modules.*))',
    ],
    transform: {
        // '^.+\\.ts$': 'babel-jest',

        // todo: kit-dnd works with ts-jest, without and with esm, no babelConfig needed;
        //       but babel-jest gives `SyntaxError: Unexpected token 'export'`
        // '^.+\\.ts$': ['babel-jest', {rootMode: 'upward', extends: './babel.config.json'/*, 'excludeJestPreset': true*/}],
        // '^.+\\.tsx$': ['babel-jest', {rootMode: 'upward', extends: './babel.config.json'/*, 'excludeJestPreset': true*/}],

        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: '<rootDir>/tsconfig-test.json',
                //babelConfig: './babel.config.json',
                diagnostics: false,
                useESM: true,
            },
        ],
        '^.+\\.tsx$': [
            'ts-jest',
            {
                tsconfig: '<rootDir>/tsconfig-test.json',
                // disable type checking until tests are typesafe
                isolatedModules: true,
                // diagnostics: false,
                // babelConfig: true,
                useESM: true,
                //babelConfig: './babel.config.json',
            },
        ],
    },

    // workaround for "react is undefined in test files" (not yet possible to confirm it works)
    // https://stackoverflow.com/a/69544200/2073149
    setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],

    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',// todo: validate ESM testing (and JSDom/react compat.), somehow this mapper was all needed - no further ts-jest/babel adjustments
        '^@ui-schema/system(.*)$': '<rootDir>/uis-system/src$1',
        '^@ui-schema/react-json-schema(.*)$': '<rootDir>/uis-react-json-schema/src$1',
        '^@ui-schema/react(.*)$': '<rootDir>/uis-react/src$1',
        '^@ui-schema/pro(.*)$': '<rootDir>/uis-pro/src$1',
        '^@ui-schema/json-pointer(.*)$': '<rootDir>/uis-json-pointer/src$1',
        '^@ui-schema/json-schema(.*)$': '<rootDir>/uis-json-schema/src$1',
        '^@ui-schema/ds-bootstrap(.*)$': '<rootDir>/ds-bootstrap/src$1',
        '^@ui-schema/ds-material(.*)$': '<rootDir>/ds-material/src$1',
        '^@ui-schema/kit-dnd(.*)$': '<rootDir>/kit-dnd/src$1',
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
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
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
            moduleDirectories: ['node_modules', '<rootDir>/' + pkg + '/node_modules'/*, '<rootDir>/' + pkg, '<rootDir>/' + pkg + '/src'*/],
            //moduleDirectories: ['node_modules', '<rootDir>/ui-schema/node_modules', '<rootDir>/ds-material/node_modules'],
            // todo: check why `transformIgnorePatterns`, combined with multi-projects/lerna 0.5.3 upgrade, throws `TypeError: /node_modules/jest-runner-eslint/build/runner/index.js: node_modules/@ampproject/remapping/dist/remapping.umd.js: _remapping(...) is not a function`
            /*transformIgnorePatterns: [
                'node_modules/?!(@ui-schema)',
            ],*/
            //testEnvironmentOptions: {},
            testMatch: [
                '<rootDir>/' + pkg + '/src/**/*.(test|spec).(js|ts|tsx)',
                '<rootDir>/' + pkg + '/tests/**/*.(test|spec).(js|ts|tsx)',
            ],
        })),
        // todo: for performance reasons it seems to be way better to use eslint via cli and not through jest
        // {
        //     displayName: 'lint',
        //     runner: 'jest-runner-eslint',
        //     ...base,
        //     testMatch: testMatchesLint,
        //     testPathIgnorePatterns: [
        //         // todo: enable linting test files again
        //         '(.*.mock).(jsx?|tsx?|ts?|js?)$',
        //         '(.*.test).(jsx?|tsx?|ts?|js?)$',
        //         '(.*.spec).(jsx?|tsx?|ts?|js?)$',
        //         // '*.mock.(jsx?|tsx?|ts?|js?)$',
        //         // '*.test.(jsx?|tsx?|ts?|js?)$',
        //     ],
        // },
    ],
    coverageDirectory: '<rootDir>/../coverage',
}

export default config

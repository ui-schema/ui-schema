import type { Config } from '@jest/types'
import { createDefaultEsmPreset } from 'ts-jest'

// helpful jest commands:
// npm run test -- --selectProjects=test-uis-react --maxWorkers=4
// npm run test -- --no-cache --selectProjects=test-uis-react --testPathPattern=WidgetEngine --maxWorkers=4
// npm run test -- --no-cache --selectProjects=test-kit-dnd --maxWorkers=4

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
        '<rootDir>/packages/' + pkg + '/src/**/*.(js|ts|tsx)',
        //'<rootDir>/packages/' + pkg + '/tests/**/*.(test|spec|d).(js|ts|tsx)',
    ])
})

const base: Partial<Config.InitialOptions> = {
    cacheDirectory: '<rootDir>/node_modules/.cache/jest-tmp',
    transformIgnorePatterns: [
        'node_modules/?!(@ui-schema)',
        // 'node_modules/(?!(.*@ui-schema.*|.*node_modules.*))',
    ],
    transform: {
        ...createDefaultEsmPreset({
            tsconfig: '<rootDir>/packages/tsconfig-test.json',
            // diagnostics: false,
            // disable type checking until tests are typesafe
            isolatedModules: true,
            // todo: it seems the babel test env is not used, not found logs from the plugin when disabled here
            babelConfig: {
                plugins: [
                    './babelImportDefaultPlugin.cjs',
                ],
            },
        }).transform,
    },

    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',// todo: validate ESM testing (and JSDom/react compat.), somehow this mapper was all needed - no further ts-jest/babel adjustments
        '^@ui-schema/system(.*)$': '<rootDir>/packages/uis-system/src$1',
        '^@ui-schema/react-json-schema(.*)$': '<rootDir>/packages/uis-react-json-schema/src$1',
        '^@ui-schema/react(.*)$': '<rootDir>/packages/uis-react/src$1',
        '^@ui-schema/pro(.*)$': '<rootDir>/packages/uis-pro/src$1',
        '^@ui-schema/json-pointer(.*)$': '<rootDir>/packages/uis-json-pointer/src$1',
        '^@ui-schema/json-schema(.*)$': '<rootDir>/packages/uis-json-schema/src$1',
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
        '.*.(test|spec).(js|ts|tsx)$',
        '<rootDir>/packages/demo-server',
        '<rootDir>/packages/demo-web',
        '<rootDir>/packages/docs',
    ],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
}

const config: Config.InitialOptions = {
    ...base,
    collectCoverage: true,
    verbose: true,
    projects: [
        ...packages.map(pkg => ({
            displayName: 'test-' + pkg,
            ...base,
            moduleDirectories: ['node_modules', '<rootDir>/packages/' + pkg + '/node_modules'/*, '<rootDir>/packages/' + pkg, '<rootDir>/packages/' + pkg + '/src'*/],
            //moduleDirectories: ['node_modules', '<rootDir>/packages/ui-schema/node_modules', '<rootDir>/packages/ds-material/node_modules'],
            testMatch: [
                '<rootDir>/packages/' + pkg + '/src/**/*.(test|spec).(js|ts|tsx)',
                '<rootDir>/packages/' + pkg + '/tests/**/*.(test|spec).(js|ts|tsx)',
            ],
        })),
    ],
    coverageDirectory: '<rootDir>/coverage',
}

export default config

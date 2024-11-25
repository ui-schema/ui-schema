import type { Config } from '@jest/types'
import { createDefaultEsmPreset } from 'ts-jest'

// helpful jest commands:
// npm run test -- --selectProjects=test-@ui-schema/react --maxWorkers=4
// npm run test -- --selectProjects=test-@ui-schema/react --testPathPattern=WidgetProps
// npm run test -- --no-cache --selectProjects=test-@ui-schema/react --testPathPattern=WidgetEngine --maxWorkers=4
// npm run test -- --no-cache --selectProjects=test-@ui-schema/kit-dnd --maxWorkers=4

const packages: [name: string, folder: string][] = [
    ['@ui-schema/system', 'uis-system'],
    ['@ui-schema/react-json-schema', 'uis-react-json-schema'],
    ['@ui-schema/react', 'uis-react'],
    ['@ui-schema/pro', 'uis-pro'],
    ['@ui-schema/json-pointer', 'uis-json-pointer'],
    ['@ui-schema/json-schema', 'uis-json-schema'],
    ['@ui-schema/ds-bootstrap', 'ds-bootstrap'],
    ['@ui-schema/ds-material', 'ds-material'],
    ['@ui-schema/kit-dnd', 'kit-dnd'],
    ['@ui-schema/dictionary', 'dictionary'],
    ['@ui-schema/material-dnd', 'material-dnd'],
    ['@ui-schema/material-pickers', 'material-pickers'],
    ['@ui-schema/material-slate', 'material-slate'],
]

const toPackageFolder = (pkg: [name: string, folder?: string]) => {
    return pkg[1] || pkg[0]
}

const base: Partial<Config.InitialOptions> = {
    cacheDirectory: '<rootDir>/node_modules/.cache/jest-tmp',
    transformIgnorePatterns: [
        'node_modules/?!(@ui-schema)',
        // 'node_modules/(?!(.*@ui-schema.*|.*node_modules.*))',
    ],
    transform: {
        // '^.+\\.js$': 'babel-jest',
        ...createDefaultEsmPreset({
            tsconfig: '<rootDir>/packages/tsconfig-test.json',
            // diagnostics: false,
            // disable type checking
            // isolatedModules: Boolean(noTypeCheck),
            isolatedModules: process.env.NO_TYPE_CHECK === 'yes',
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
        ...packages.reduce((nameMapper, pkg) => {
            nameMapper[`^${pkg[0]}\\/(.*)$`] = `<rootDir>/packages/${toPackageFolder(pkg)}/src/$1`
            nameMapper[`^${pkg[0]}$`] = `<rootDir>/packages/${toPackageFolder(pkg)}/src`
            return nameMapper
        }, {}),
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    coveragePathIgnorePatterns: [
        '(tests/.*.mock).(jsx?|tsx?|ts?|js?)$',
        '.*.(test|spec).(js|ts|tsx)$',
        '<rootDir>/packages/demo-server',
        '<rootDir>/packages/demo-web',
        '<rootDir>/packages/docs',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/packages/.+/build/',
    ],
    watchPathIgnorePatterns: [
        '<rootDir>/.idea',
        '<rootDir>/.git',
        '<rootDir>/dist/',
        '<rootDir>/node_modules/',
        '<rootDir>/packages/.+/node_modules/',
        '<rootDir>/packages/.+/build/',
    ],
    modulePathIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/packages/.+/build/',
    ],
}

const config: Config.InitialOptions = {
    ...base,
    collectCoverage: true,
    verbose: true,
    projects: [
        ...packages.map((pkg) => ({
            displayName: 'test-' + pkg[0],
            ...base,
            moduleDirectories: ['node_modules', '<rootDir>/packages/' + toPackageFolder(pkg) + '/node_modules'/*, '<rootDir>/packages/' + pkg, '<rootDir>/packages/' + pkg + '/src'*/],
            //moduleDirectories: ['node_modules', '<rootDir>/packages/ui-schema/node_modules', '<rootDir>/packages/ds-material/node_modules'],
            testMatch: [
                '<rootDir>/packages/' + toPackageFolder(pkg) + '/src/**/*.(test|spec).(js|ts|tsx)',
                '<rootDir>/packages/' + toPackageFolder(pkg) + '/tests/**/*.(test|spec).(js|ts|tsx)',
            ],
        })),
    ],
    coverageDirectory: '<rootDir>/coverage',
}

export default config

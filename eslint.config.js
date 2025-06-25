import babelParser from '@babel/eslint-parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import tsParser from '@typescript-eslint/parser'
import stylistic from '@stylistic/eslint-plugin'
// import typescriptEs from '@typescript-eslint/eslint-plugin'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import {defineConfig} from 'eslint/config'
// import { FlatCompat } from '@eslint/eslintrc'

// const compat = new FlatCompat()

export default defineConfig([
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    reactHooks.configs['recommended-latest'],
    react.configs.flat['jsx-runtime'],
    {
        ...react.configs.flat.recommended,
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    //
    //
    // "compat is not a function" (but from official eslint quick start)
    // compat({
    //     extends: [
    //         "eslint:recommended",
    //         "plugin:react/recommended",
    //         "plugin:@typescript-eslint/eslint-recommended",
    //         "plugin:@typescript-eslint/recommended",
    //         "plugin:react-hooks/recommended"
    //     ],
    // }),
    {
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
            parser: babelParser,
            globals: {
                ...globals.browser,
                ...globals.serviceworker,
            },
        },
        plugins: {
            react: react,
        },
        settings: {
            linkComponents: [
                'Hyperlink',
                {name: 'Link', linkAttribute: 'href'},
            ],
        },
        rules: {
            'no-console': 'off',
            // "react/display-name": "error",
            'react/forbid-prop-types': 'warn',
            'react/jsx-boolean-value': 'warn',
            'react/jsx-closing-bracket-location': 'off',
            'react/jsx-curly-spacing': 'warn',
            'react/jsx-handler-names': 'off',
            'react/jsx-indent-props': 'warn',
            'react/jsx-key': 'warn',
            'react/jsx-no-bind': 'off',
            'react/jsx-no-duplicate-props': 'warn',
            'react/jsx-no-undef': 'warn',
            'react/jsx-no-target-blank': 'warn',
            'react/jsx-pascal-case': 'warn',
            'react/jsx-uses-react': 'warn',
            'react/jsx-uses-vars': 'warn',
            'react/no-danger': 'off',
            'react/no-did-mount-set-state': 'off',
            'react/no-did-update-set-state': 'off',
            'react/no-direct-mutation-state': 'warn',
            'react/no-multi-comp': 'off',
            'react/no-set-state': 'off',
            'react/no-unknown-property': 'warn',
            'react/prefer-es6-class': 'warn',
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'warn',
            'react/self-closing-comp': 'warn',
            'react/sort-comp': 'off',
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
            },
            globals: {
                ...globals.browser,
                ...globals.serviceworker,
            },
        },
        plugins: {
            react: react,
            '@stylistic': stylistic,
        },
        rules: {
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    'caughtErrors': 'none',
                },
            ],
            '@typescript-eslint/no-empty-interface': 'error',
            '@typescript-eslint/no-deprecated': [
                'error',
                {
                    // not working as `const` are not supported
                    // https://github.com/typescript-eslint/typescript-eslint/pull/10670
                    'allow': [
                        {
                            'from': 'package',
                            'name': 'CombiningHandler',
                            'package': '@ui-schema/react-json-schema',
                        },
                        {
                            'from': 'file',
                            'name': 'CombiningHandler',
                            'path': 'CombiningHandler.tsx',
                        },
                        {
                            'from': 'file',
                            'name': 'CombiningHandler',
                        },
                        {
                            'from': 'package',
                            'name': 'InputLabelProps',
                            'package': '@mui/material',
                        },
                        {
                            'from': 'package',
                            'name': 'InputProps',
                            'package': '@mui/material',
                        },
                        {
                            'from': 'package',
                            'name': 'inputProps',
                            'package': '@mui/material',
                        },
                        {
                            'from': 'package',
                            'name': 'Grid',
                            'package': '@mui/material',
                        },
                        {
                            'from': 'package',
                            'name': 'Grid',
                            'package': '@mui/material/Grid',
                        },
                        {
                            'from': 'package',
                            'name': 'default',
                            'package': '@mui/material',
                        },
                        {
                            'from': 'package',
                            'name': 'default',
                            'package': '@mui/material/Grid',
                        },
                        {
                            'from': 'package',
                            'name': 'componentsProps',
                            'package': '@mui/material',
                        },
                    ],
                },
            ],
            'indent': [
                'error',
                4,
                {
                    'SwitchCase': 1,
                },
            ],
            '@stylistic/member-delimiter-style': [
                'error',
                {
                    'multiline': {
                        'delimiter': 'none',
                        'requireLast': false,
                    },
                    'singleline': {
                        'delimiter': 'comma',
                        'requireLast': false,
                    },
                },
            ],
            '@stylistic/semi': [
                'warn',
                'never',
            ],
            'semi-style': 'off',
            'no-trailing-spaces': 'warn',
            'comma-dangle': [
                'error',
                {
                    'arrays': 'always-multiline',
                    'objects': 'always-multiline',
                    'imports': 'always-multiline',
                    'exports': 'always-multiline',
                    'functions': 'only-multiline',
                },
            ],
            'react/display-name': [
                'error',
                {
                    ignoreTranspilerName: false,
                },
            ],
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'no-redundant-jsdoc': 'off',
            '@typescript-eslint/consistent-indexed-object-style': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-wrapper-object-types': 'off',
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        files: [
            '**/demo-server/*.{ts,tsx,mjs,js}',
            'packerConfig.js',
            'jest.config.ts',
        ],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        ignores: ['**/build/**', '**/node_modules/**'],
    },
])

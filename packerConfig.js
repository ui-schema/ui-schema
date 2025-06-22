import path, {dirname} from 'node:path'
import {packer, webpack} from 'lerna-packer'
import {copyRootPackageJson, makeModulePackageJson} from 'lerna-packer/packer/modulePackages.js'
import fs from 'node:fs'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const babelTargetsEsmCjs = [
    {
        distSuffix: '',
        args: [
            '--env-name', 'cjs', '--no-comments', // '--copy-files', '--no-copy-ignored',
            // note: even with defined extension, the extensions of `import` are still `.js`
            //       which would break relative imports, as they then import ESM instead of the CJS file;
            //       thus added `babel-plugin-replace-import-extension` for the CJS environment
            //       it's not validated how it behaves for external imports for third-party modules,
            //       which can be problematic in other projects,
            //       here `import` to 3rd party modules are done purely by package name
            '--out-file-extension', '.cjs',
            '--extensions', '.ts', '--extensions', '.tsx', '--extensions', '.js', '--extensions', '.jsx',
            '--ignore', '**/*.d.ts',
            '--ignore', '**/*.test.tsx', '--ignore', '**/*.test.ts', '--ignore', '**/*.test.js',
            '--ignore', '**/*.mock.ts', '--ignore', '**/*.mock.js',
        ],
    },
    {
        distSuffix: '',
        args: [
            '--no-comments',
            '--extensions', '.ts', '--extensions', '.tsx', '--extensions', '.js', '--extensions', '.jsx',
            '--ignore', '**/*.d.ts',
            '--ignore', '**/*.test.tsx', '--ignore', '**/*.test.ts', '--ignore', '**/*.test.js',
            '--ignore', '**/*.mock.ts', '--ignore', '**/*.mock.js',
        ],
    },
]

const transformerForEsmCjs = () => {
    return {
        sideEffects: false,
        main: './index.cjs',
        module: './index.js',
        types: './index.d.ts',
    }
}

const packages = {
    uiSchemaSystem: {
        name: '@ui-schema/ui-schema',
        doServeWatch: false,
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'ui-schema'),
        entry: path.resolve(__dirname, 'packages', 'ui-schema/src/'),
        babelTargets: babelTargetsEsmCjs,
    },
    uiSchemaReact: {
        name: '@ui-schema/react',
        doServeWatch: false,
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'react'),
        entry: path.resolve(__dirname, 'packages', 'react/src/'),
        babelTargets: babelTargetsEsmCjs,
    },
    uiSchemaReactJsonSchema: {
        name: '@ui-schema/react-json-schema',
        doServeWatch: false,
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'react-json-schema'),
        entry: path.resolve(__dirname, 'packages', 'react-json-schema/src/'),
        babelTargets: babelTargetsEsmCjs,
    },
    uiSchemaJsonSchema: {
        name: '@ui-schema/json-schema',
        doServeWatch: false,
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'json-schema'),
        entry: path.resolve(__dirname, 'packages', 'json-schema/src/'),
        babelTargets: babelTargetsEsmCjs,
    },
    uiSchemaJsonPointer: {
        name: '@ui-schema/json-pointer',
        doServeWatch: false,
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'json-pointer'),
        entry: path.resolve(__dirname, 'packages', 'json-pointer/src/'),
        babelTargets: babelTargetsEsmCjs,
    },
    uiSchemaPro: {
        name: '@ui-schema/pro',
        doServeWatch: false,
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'pro'),
        entry: path.resolve(__dirname, 'packages', 'pro/src/'),
        babelTargets: babelTargetsEsmCjs,
    },
    uiSchemaDictionary: {
        name: '@ui-schema/dictionary',
        doServeWatch: false,
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'dictionary'),
        entry: path.resolve(__dirname, 'packages', 'dictionary/src/'),
        babelTargets: babelTargetsEsmCjs,
    },
    dsMaterial: {
        // noClean: true,
        name: '@ui-schema/ds-material',
        doServeWatch: false,
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'ds-material'),
        entry: path.resolve(__dirname, 'packages', 'ds-material/src/'),
        // babelTargets: legacyBabelTargets,
        babelTargets: babelTargetsEsmCjs,
    },
    dsBootstrap: {
        name: '@ui-schema/ds-bootstrap',
        doServeWatch: false,
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'ds-bootstrap'),
        entry: path.resolve(__dirname, 'packages', 'ds-bootstrap/src/'),
        // babelTargets: legacyBabelTargets,
        babelTargets: babelTargetsEsmCjs,
    },
    kitDnd: {
        name: '@ui-schema/kit-dnd',
        doServeWatch: false,
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'kit-dnd'),
        entry: path.resolve(__dirname, 'packages', 'kit-dnd/src/'),
        babelTargets: babelTargetsEsmCjs,
    },
    materialPickers: {
        name: '@ui-schema/material-pickers',
        doServeWatch: false,
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'material-pickers'),
        entry: path.resolve(__dirname, 'packages', 'material-pickers/src/'),
        babelTargets: babelTargetsEsmCjs,
    },
    materialSlate: {
        name: '@ui-schema/material-slate',
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'material-slate'),
        entry: path.resolve(__dirname, 'packages', 'material-slate/src/'),
        babelTargets: babelTargetsEsmCjs,
    },
    materialEditorJs: {
        name: '@ui-schema/material-editorjs',
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'material-editorjs'),
        entry: path.resolve(__dirname, 'packages', 'material-editorjs/src/'),
        babelTargets: babelTargetsEsmCjs,
    },
    materialDnd: {
        name: '@ui-schema/material-dnd',
        doServeWatch: false,
        esmOnly: false,
        root: path.resolve(__dirname, 'packages', 'material-dnd'),
        entry: path.resolve(__dirname, 'packages', 'material-dnd/src/'),
        babelTargets: babelTargetsEsmCjs,
    },
}

// const require = createRequire(import.meta.url)

const webpackEslintConfig = {
    // note: eslint@8/lerna-packer@0.10.x compat:
    // eslintPath: require.resolve('eslint/use-at-your-own-risk'),
    // configType: 'eslintrc',
}

packer({
    apps: {
        demoWeb: {
            root: path.resolve(__dirname, 'packages', 'demo-web'),
            template: path.resolve(__dirname, 'packages', 'demo-web/public/index.html'),
            contentBase: path.resolve(__dirname, 'packages', 'demo-web/public'),// dev-server
            port: 4200,
            main: path.resolve(__dirname, 'packages', 'demo-web/src/index.tsx'),
            dist: path.resolve(__dirname, 'dist', 'demo-web'),
            devServer: {
                client: {
                    overlay: false,
                    progress: false,
                },
            },
            publicPath: '/',
            aliasPackagesBuild: 'production',
            eslintOptions: webpackEslintConfig,
        },
        pickersDemo: {
            root: path.resolve(__dirname, 'packages', 'material-pickers'),
            rootSrc: 'demo/src',
            template: path.resolve(__dirname, 'packages', 'material-pickers/demo/public/index.html'),
            contentBase: path.resolve(__dirname, 'packages', 'material-pickers/demo/public'),// dev-server
            port: 4202,
            main: path.resolve(__dirname, 'packages', 'material-pickers/demo/src/index.tsx'),
            dist: path.resolve(__dirname, 'dist', 'pickers-demo'),
            devServer: {
                client: {
                    overlay: false,
                    progress: false,
                },
            },
            publicPath: '/',
            aliasPackagesBuild: 'production',
            eslintOptions: webpackEslintConfig,
        },
        docs: {
            root: path.resolve(__dirname, 'packages', 'docs'),
            template: path.resolve(__dirname, 'packages', 'docs/public/index.html'),
            contentBase: path.resolve(__dirname, 'packages', 'docs/public'),// dev-server
            port: 4201,
            main: path.resolve(__dirname, 'packages', 'docs/src/index.tsx'),
            dist: path.resolve(__dirname, 'dist', 'docs'),
            publicPath: '/',
            devServer: {
                client: {
                    overlay: false,
                    progress: false,
                },
                historyApiFallback: {
                    disableDotRule: true,
                },
            },
            cacheGroups: {
                uis: {
                    test: /[\\/]packages[\\/]ui-schema[\\/]/,
                    reuseExistingChunk: true,
                    usedExports: true,
                    name: 'uis',
                    chunks: 'all',
                    minChunks: 1,
                    minSize: 100,
                    enforce: true,
                },
                dsm: {
                    test: /[\\/]packages[\\/]ds-material[\\/]/,
                    reuseExistingChunk: true,
                    usedExports: true,
                    name: 'dsm',
                    chunks: 'all',
                    minChunks: 1,
                    minSize: 100,
                    enforce: true,
                },
                mx: {
                    test: /[\\/]packages[\\/]material-/,
                    reuseExistingChunk: true,
                    usedExports: true,
                    name: 'mx',
                    chunks: 'all',
                    minChunks: 1,
                    minSize: 100,
                    enforce: true,
                },
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    // reuseExistingChunk: true,
                    usedExports: true,
                    name: 'react',
                    priority: 10,
                    chunks: 'all',
                    enforce: true,
                },
                common1: {
                    test: /[\\/]node_modules[\\/](@mui|@emotion|@control-ui[\\/]app|@control-ui[\\/]kit)[\\/]/,
                    // reuseExistingChunk: true,
                    usedExports: true,
                    name: 'c1',
                    priority: 9,
                    chunks: 'all',
                    minChunks: 1,
                    minSize: 375000,
                    maxSize: 475000,
                    // enforce: true,
                },
                common2: {
                    test: /[\\/]node_modules[\\/](immutable|react-helmet|react-error-boundary|react-uid|react-router|react-router-dom|i18next*|react-i18next|@bemit)[\\/]/,
                    // reuseExistingChunk: true,
                    usedExports: true,
                    name: 'c2',
                    priority: 8,
                    chunks: 'all',
                    minChunks: 1,
                    minSize: 150000,
                    maxSize: 500000,
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    reuseExistingChunk: true,
                    usedExports: true,
                    name: 'vendor',
                    chunks: 'all',
                    priority: -2,
                    minChunks: 5,
                    maxSize: 265000,
                },
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
            },
            webpackConfig: {
                build: {
                    optimization: {
                        splitChunks: {
                            usedExports: true,
                            maxAsyncRequests: 35,
                            maxInitialRequests: 35,
                        },
                    },
                },
            },
            copy: [{from: path.resolve(__dirname, 'schema'), to: path.resolve(__dirname, 'dist', 'docs', 'schema')}],
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                    'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_ENV),
                    'process.env.REACT_APP_G_TAG': JSON.stringify(process.env.REACT_APP_G_TAG || 'G-0PGCF34TJK'),
                }),
            ],
            // noParse: [require.resolve('typescript/lib/typescript.js')],
            aliasPackagesBuild: 'production',
            eslintOptions: webpackEslintConfig,
        },
    },
    backends: {
        demoServer: {
            root: path.resolve(__dirname, 'packages', 'demo-server'),
            src: 'src',
            entry: 'server.js',
            babelArgs: [
                '--env-name', 'node', '--extensions', '.ts', '--extensions', '.js', '--ignore', '**/*.d.ts',
                '--copy-files',
            ],
            nodemonArgs: [
                '-e', 'js,ts,tsx,jsx,json,scss',
                '-w', path.resolve(__dirname, 'packages', 'react') + '/**/*.ts',
                '-w', path.resolve(__dirname, 'packages', 'json-pointer') + '/**/*.ts',
                '-w', path.resolve(__dirname, 'packages', 'ui-schema') + '/**/*.ts',
            ],
            nodeExperimental: {
                jsonModules: true,
            },
        },
    },
    packages: packages,
}, __dirname, {
    afterEsModules: (packages, pathBuild, isServing) => {
        const nonStrictPackages = [
            'dsMaterial',
            'materialDnd',
            'materialEditorjs',
            'materialPickers',
            'materialSlate',
        ]
        return Promise.all([
            makeModulePackageJson(transformerForEsmCjs)(
                Object.keys(packages).reduce(
                    (packagesFiltered, pack) =>
                        nonStrictPackages.includes(pack) ? {...packagesFiltered, [pack]: packages[pack]} : packagesFiltered,
                    {},
                ),
                pathBuild,
            ),
            ...(isServing ? [] : [copyRootPackageJson()(packages, pathBuild)]),
        ]).then(() => undefined).catch((e) => {
            console.error('ERROR after-es-mod', e)
            return Promise.reject(e)
        })
    },
})
    .then(([execs, elapsed]) => {
        if (execs.indexOf('doServe') !== -1) {
            console.log('[packer] is now serving (after ' + elapsed + 'ms)')
        } else {
            if (execs.indexOf('doBuildBabel') !== -1) {
                const nodePackages = [
                    // [path, esmOnly]
                    // [path.resolve(__dirname, 'packages', 'ui-schema'), true],
                    // [path.resolve(__dirname, 'packages', 'json-pointer'), true],
                    // [path.resolve(__dirname, 'packages', 'json-schema'), true],
                    ...Object.values(packages).map(pkg => {
                        return [pkg.root, pkg.esmOnly]
                    }),
                ]

                const saver = nodePackages.map(([pkg/*, esmOnly*/]) => {
                    return new Promise(((resolve, reject) => {
                        console.log(' rewrite package.json of ' + pkg)
                        const packageFile = JSON.parse(fs.readFileSync(path.join(pkg, 'package.json')).toString())
                        // todo: for backends: here check all `devPackages` etc. an replace local-packages with `file:` references,
                        //       then copy the `build` of that package to e.g. `_modules` in the backend `build`
                        if (packageFile.exports) {
                            packageFile.exports = Object.keys(packageFile.exports).reduce((exp, pkgName) => {
                                let pkgExportsFinal
                                const pkgExports = packageFile.exports[pkgName]
                                const changeFolder = (maybePrefixedFolder) =>
                                    maybePrefixedFolder.startsWith('./build/') ?
                                        '.' + maybePrefixedFolder.slice('./build'.length) :
                                        maybePrefixedFolder.startsWith('./src/') ?
                                            '.' + maybePrefixedFolder.slice('./src'.length) :
                                            maybePrefixedFolder
                                if (typeof pkgExports === 'string') {
                                    pkgExportsFinal = changeFolder(pkgExports)
                                } else if (typeof pkgExports === 'object') {
                                    pkgExportsFinal = Object.keys(pkgExports).reduce((pkgExportsNext, pkgExport) => {
                                        let pkgExportNext = changeFolder(pkgExports[pkgExport])
                                        let cjs = undefined
                                        // if (pkgExport === 'import' && !esmOnly) {
                                        //     if (!pkgExport['require']) {
                                        //         cjs = {'require': pkgExportNext}
                                        //     }
                                        //     pkgExportNext = pkgExportNext.startsWith('./esm/') ? pkgExportNext : './esm' + pkgExportNext.slice(1)
                                        // }
                                        return {
                                            ...pkgExportsNext,
                                            [pkgExport]:
                                                pkgExportNext.endsWith('.ts') && !pkgExportNext.endsWith('.d.ts') ?
                                                    pkgExportNext.slice(0, -3) + '.d.ts' : pkgExportNext,
                                            ...cjs || {},
                                        }
                                    }, {})
                                } else {
                                    throw new Error(`package exports could not be generated for ${pkgName}`)
                                }
                                return {
                                    ...exp,
                                    [pkgName]: pkgExportsFinal,
                                }
                            }, packageFile.exports)
                        }
                        if (packageFile.module && packageFile.module.startsWith('build/')) {
                            packageFile.module = packageFile.module.slice('build/'.length)
                        }
                        if (packageFile.module && packageFile.module.startsWith('src/')) {
                            packageFile.module = packageFile.module.slice('src/'.length)
                        }
                        if (packageFile.main && packageFile.main.startsWith('build/')) {
                            packageFile.main = packageFile.main.slice('build/'.length)
                        }
                        if (packageFile.main && packageFile.main.startsWith('src/')) {
                            packageFile.main = packageFile.main.slice('src/'.length)
                        }
                        if (packageFile.typings && packageFile.typings.startsWith('build/')) {
                            packageFile.typings = packageFile.typings.slice('build/'.length)
                        }
                        if (packageFile.typings && packageFile.typings.startsWith('src/')) {
                            packageFile.typings = packageFile.typings.slice('src/'.length)
                        }
                        if (packageFile.types && packageFile.types.startsWith('build/')) {
                            packageFile.types = packageFile.types.slice('build/'.length)
                        }
                        if (packageFile.types && packageFile.types.startsWith('src/')) {
                            packageFile.types = packageFile.types.slice('src/'.length)
                        }
                        fs.writeFile(path.join(pkg, 'build', 'package.json'), JSON.stringify(packageFile, null, 4), (err) => {
                            if (err) {
                                reject(err)
                                return
                            }
                            resolve()
                        })
                    }))
                })
                Promise.all(saver)
                    .then(() => {
                        console.log('[packer] finished successfully (after ' + elapsed + 'ms)', execs)
                        process.exit(0)
                    })
                    .catch((e) => {
                        console.error('packerConfig', e)
                    })
            } else {
                console.log('[packer] finished successfully (after ' + elapsed + 'ms)', execs)
                process.exit(0)
            }
        }
    })
    .catch((e) => {
        console.error('[packer] finished with error(s)', e)
        process.exit(1)
    })

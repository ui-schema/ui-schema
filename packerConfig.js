const path = require('path');
const {packer, webpack} = require('lerna-packer');
const {makeModulePackageJson, copyRootPackageJson, transformForEsModule} = require('lerna-packer/packer/modulePackages');
const fs = require('fs');

// todo: once no `.d.ts` are used, remove the `copy-files` again / use lerna-packer default again
const legacyBabelTargets = [
    {
        distSuffix: '',
        args: [
            '--env-name', 'cjs', '--no-comments', '--copy-files',
            '--extensions', '.ts', '--extensions', '.tsx', '--extensions', '.js', '--extensions', '.jsx',
            '--ignore', '**/*.d.ts',
            '--ignore', '**/*.test.tsx', '--ignore', '**/*.test.ts', '--ignore', '**/*.test.js',
        ],
    },
    {
        distSuffix: '/esm', args: [
            '--no-comments',
            '--extensions', '.ts', '--extensions', '.tsx', '--extensions', '.js', '--extensions', '.jsx',
            '--ignore', '**/*.d.ts',
            '--ignore', '**/*.test.tsx', '--ignore', '**/*.test.ts', '--ignore', '**/*.test.js',
        ],
    },
]

packer({
    apps: {
        demoWeb: {
            root: path.resolve(__dirname, 'packages', 'demo-web'),
            template: path.resolve(__dirname, 'packages', 'demo-web/public/index.html'),
            contentBase: path.resolve(__dirname, 'packages', 'demo-web/public'),// dev-server
            port: 4200,
            main: path.resolve(__dirname, 'packages', 'demo-web/src/index.js'),
            dist: path.resolve(__dirname, 'dist', 'demo-web'),
            devServer: {
                client: {
                    overlay: false,
                    progress: false,
                },
            },
            publicPath: '/',
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
                    test: /[\\/]node_modules[\\/](@mui|@emotion|@control-ui[\\/]app|@control-ui[\\/]kit|react-loadable)[\\/]/,
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
            noParse: [require.resolve('typescript/lib/typescript.js')],
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
                '-e', 'js,json,twig,scss',
                '-w', path.resolve(__dirname, 'packages', 'uis-json-schema') + '/**/*.ts',
                '-w', path.resolve(__dirname, 'packages', 'uis-json-pointer') + '/**/*.ts',
                '-w', path.resolve(__dirname, 'packages', 'uis-system') + '/**/*.ts',
            ],
            nodeExperimental: {
                jsonModules: true,
            },
        },
    },
    packages: {
        // the keys are the commonjs names that is applied to externals
        // this is the same as `@babel/plugin-transform-modules-commonjs` applies
        uiSchema: {
            name: '@ui-schema/ui-schema',
            root: path.resolve(__dirname, 'packages', 'ui-schema'),
            entry: path.resolve(__dirname, 'packages', 'ui-schema/src/'),
            babelTargets: legacyBabelTargets,
        },
        uiSchemaSystem: {
            name: '@ui-schema/system',
            doServeWatch: true,
            root: path.resolve(__dirname, 'packages', 'uis-system'),
            entry: path.resolve(__dirname, 'packages', 'uis-system/src/'),
        },
        uiSchemaReact: {
            name: '@ui-schema/react',
            root: path.resolve(__dirname, 'packages', 'uis-react'),
            entry: path.resolve(__dirname, 'packages', 'uis-react/src/'),
        },
        uiSchemaReactJsonSchema: {
            name: '@ui-schema/react-json-schema',
            root: path.resolve(__dirname, 'packages', 'uis-react-json-schema'),
            entry: path.resolve(__dirname, 'packages', 'uis-react-json-schema/src/'),
        },
        uiSchemaJsonSchema: {
            name: '@ui-schema/json-schema',
            doServeWatch: true,
            root: path.resolve(__dirname, 'packages', 'uis-json-schema'),
            entry: path.resolve(__dirname, 'packages', 'uis-json-schema/src/'),
        },
        uiSchemaJsonPointer: {
            name: '@ui-schema/json-pointer',
            doServeWatch: true,
            root: path.resolve(__dirname, 'packages', 'uis-json-pointer'),
            entry: path.resolve(__dirname, 'packages', 'uis-json-pointer/src/'),
        },
        /*uiSchemaPro: {
            name: '@ui-schema/pro',
            root: path.resolve(__dirname, 'packages', 'uis-pro'),
            entry: path.resolve(__dirname, 'packages', 'uis-pro/src/'),
        },*/
        uiSchemaDictionary: {
            name: '@ui-schema/dictionary',
            root: path.resolve(__dirname, 'packages', 'dictionary'),
            entry: path.resolve(__dirname, 'packages', 'dictionary/src/'),
        },
        dsMaterial: {
            // noClean: true,
            name: '@ui-schema/ds-material',
            root: path.resolve(__dirname, 'packages', 'ds-material'),
            entry: path.resolve(__dirname, 'packages', 'ds-material/src/'),
            babelTargets: legacyBabelTargets,
        },
        /*dsBootstrap: {
            name: '@ui-schema/ds-bootstrap',
            root: path.resolve(__dirname, 'packages', 'ds-bootstrap'),
            entry: path.resolve(__dirname, 'packages', 'ds-bootstrap/src/'),
            babelTargets: legacyBabelTargets,
        },
        kitDnd: {
            name: '@ui-schema/kit-dnd',
            root: path.resolve(__dirname, 'packages', 'kit-dnd'),
            entry: path.resolve(__dirname, 'packages', 'kit-dnd/src/'),
        },
        materialPickers: {
            name: '@ui-schema/material-pickers',
            root: path.resolve(__dirname, 'packages', 'material-pickers'),
            entry: path.resolve(__dirname, 'packages', 'material-pickers/src/'),
        },
        materialSlate: {
            name: '@ui-schema/material-slate',
            root: path.resolve(__dirname, 'packages', 'material-slate'),
            entry: path.resolve(__dirname, 'packages', 'material-slate/src/'),
        },
        materialEditorJs: {
            name: '@ui-schema/material-editorjs',
            root: path.resolve(__dirname, 'packages', 'material-editorjs'),
            entry: path.resolve(__dirname, 'packages', 'material-editorjs/src/'),
        },
        materialDnd: {
            name: '@ui-schema/material-dnd',
            root: path.resolve(__dirname, 'packages', 'material-dnd'),
            entry: path.resolve(__dirname, 'packages', 'material-dnd/src/'),
        },*/
    },
}, __dirname, {
    afterEsModules: (packages, pathBuild, isServing) => {
        return Promise.all([
            makeModulePackageJson(transformForEsModule)(
                Object.keys(packages).reduce(
                    (packagesFiltered, pack) =>
                        packages[pack].esmOnly ? packagesFiltered : {...packagesFiltered, [pack]: packages[pack]},
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
        if(execs.indexOf('doServe') !== -1) {
            console.log('[packer] is now serving (after ' + elapsed + 'ms)')
        } else {
            if(execs.indexOf('doBuild') !== -1 && execs.indexOf('doBuildBackend') !== -1) {
                const nodePackages = [
                    path.resolve(__dirname, 'packages', 'uis-system'),
                    path.resolve(__dirname, 'packages', 'uis-json-pointer'),
                    path.resolve(__dirname, 'packages', 'uis-json-schema'),
                ]

                const saver = nodePackages.map((pkg) => {
                    return new Promise(((resolve, reject) => {
                        const packageFile = JSON.parse(fs.readFileSync(path.join(pkg, 'package.json')).toString())
                        // todo: for backends: here check all `devPackages` etc. an replace local-packages with `file:` references,
                        //       then copy the `build` of that package to e.g. `_modules` in the backend `build`
                        if(packageFile.exports) {
                            packageFile.exports = Object.keys(packageFile.exports).reduce((exp, pkgName) => ({
                                ...exp,
                                [pkgName]:
                                    packageFile.exports[pkgName].startsWith('./build/') ?
                                        '.' + packageFile.exports[pkgName].slice('./build'.length) :
                                        packageFile.exports[pkgName].startsWith('./src/') ?
                                            '.' + packageFile.exports[pkgName].slice('./src'.length) :
                                            packageFile.exports[pkgName],
                            }), packageFile.exports)
                        }
                        if(packageFile.main && packageFile.main.startsWith('build/')) {
                            packageFile.main = packageFile.main.slice('build/'.length)
                        }
                        if(packageFile.main && packageFile.main.startsWith('src/')) {
                            packageFile.main = packageFile.main.slice('src/'.length)
                        }
                        if(packageFile.typings && packageFile.typings.startsWith('build/')) {
                            packageFile.typings = packageFile.typings.slice('build/'.length)
                        }
                        if(packageFile.typings && packageFile.typings.startsWith('src/')) {
                            packageFile.typings = packageFile.typings.slice('src/'.length)
                        }
                        if(packageFile.types && packageFile.types.startsWith('build/')) {
                            packageFile.types = packageFile.types.slice('build/'.length)
                        }
                        if(packageFile.types && packageFile.types.startsWith('src/')) {
                            packageFile.types = packageFile.types.slice('src/'.length)
                        }
                        fs.writeFile(path.join(pkg, 'build', 'package.json'), JSON.stringify(packageFile, null, 4), (err) => {
                            if(err) {
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


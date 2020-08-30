'use strict';

const path = require('path');
const {merge} = require('webpack-merge');
const isWsl = require('is-wsl');
const TerserPlugin = require('terser-webpack-plugin');

const commonBabelPlugins = [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-react-jsx",
    "@babel/plugin-transform-template-literals",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-transform-runtime",
    "transform-es2015-template-literals",
    "es6-promise",
    "react-loadable/babel",
    [
        //require.resolve('babel-plugin-named-asset-import'),
        'babel-plugin-named-asset-import',
        {
            loaderMap: {
                svg: {
                    ReactComponent:
                        '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                },
            },
        },
    ],
];

function getConfig(
    customConfig = {},
    {
        context = '',
        minimize = true,
        babelPresets = [],
        babelPlugins = [],
        include = [],
    } = {},
) {
    const config = {
        resolve: {
            extensions: ['.js']
        },
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.(ts|js|jsx|tsx)$/,
                    //test: /\.(js|jsx|d\.ts)$/,
                    include: [
                        path.join(context, 'src'),
                        ...include,
                    ],
                    options: {
                        cache: true,
                        formatter: require.resolve('react-dev-utils/eslintFormatter'),
                        eslintPath: require.resolve('eslint'),
                        emitWarning: !(customConfig.mode === 'production'),
                        //failOnError: true,
                        //failOnWarning: true,
                    },
                    loader: require.resolve('eslint-loader'),
                }, {
                    test: /\.(js|jsx)$/,
                    include: [
                        path.join(context, 'src'),
                        ...include,
                    ],
                    use: [{
                        loader: "babel-loader",
                        options: {
                            /*presets: [
                                ...babelPresets,
                            ],
                            plugins: [
                                ...babelPlugins,
                            ],*/
                            // This is a feature of `babel-loader` for webpack (not Babel itself).
                            // It enables caching results in ./node_modules/.cache/babel-loader/
                            // directory for faster rebuilds.
                            cacheDirectory: true,
                            // See #6846 for context on why cacheCompression is disabled
                            cacheCompression: false,
                            compact: minimize,
                        }
                    }]
                }, {
                    // Process any JS outside of the app with Babel.
                    // Unlike the application JS, we only compile the standard ES features.
                    test: /\.(js|mjs)$/,
                    exclude: [
                        /@babel(?:\/|\\{1,2})runtime/,
                        path.join(context, 'src'),
                        ...include,
                    ],
                    loaders: 'babel-loader',
                    options: {
                        babelrc: false,
                        configFile: false,
                        compact: false,
                        presets: [
                            [
                                require.resolve('babel-preset-react-app/dependencies'),
                                {helpers: true},
                            ],
                        ],
                        cacheDirectory: true,
                        cacheCompression: false,

                        // If an error happens in a package, it's possible to be
                        // because it was compiled. Thus, we don't want the browser
                        // debugger to show the original code. Instead, the code
                        // being evaluated would be much more helpful.
                        sourceMaps: false,
                    },
                }, {
                    test: /\.html$/i,
                    // exclude: [/node_modules/],
                    use: [{
                        loader: 'ejs-loader'
                    }, {
                        loader: 'extract-loader'
                    }, {
                        loader: 'html-loader',
                        options: {
                            minimize: minimize,
                            interpolate: false,
                        }
                    }],
                }, {
                    test: /\.css$/i,
                    exclude: [/node_modules/],
                    loader: 'style-loader!css-loader'
                }, {
                    test: /\.css$/i,
                    include: [/node_modules/],
                    use: [
                        {loader: 'style-loader', options: {injectType: 'lazySingletonStyleTag'}},
                        'css-loader',
                    ],
                }, {
                    test: /\.s[ac]ss$/i,
                    exclude: [/node_modules/],
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        optimization: {
            minimize: minimize,
            minimizer: [new TerserPlugin({
                terserOptions: {
                    parse: {
                        // We want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minification steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending further investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    // Added for profiling in devtools
                    keep_classnames: false,
                    keep_fnames: false,
                    /*keep_classnames: isEnvProductionProfile,
                    keep_fnames: isEnvProductionProfile,*/
                    output: {
                        ecma: 5,
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: true,
                    },
                },
                // Use multi-process parallel running to improve the build speed
                // Default number of concurrent runs: os.cpus().length - 1
                // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
                // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
                parallel: !isWsl,
                // Enable file caching
                cache: true,
                sourceMap: true,
            })],
        },
    };

    return merge(config, customConfig);
}

exports.getConfig = getConfig;
exports.commonBabelPlugins = commonBabelPlugins;

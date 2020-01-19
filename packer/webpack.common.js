'use strict';

const path = require('path');
const isWsl = require('is-wsl');
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

function getConfig({
                       context,
                       mode,
                       entry,
                       output,
                       rules = [],
                       minimize = true,
                       performance = {
                           hints: 'warning'
                       },
                       resolve = [],
                       plugins = [],
                       externals = {},
                       splitChunks = false,
                       devServer = false,
                       devtool = false,
                   } = {},
                   include = []) {
    const config = {
        mode: mode,
        entry: {...entry},
        output: {...output},
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.(js|jsx)$/,
                    //exclude: /node_modules/,
                    include: [
                        path.join(context, 'src'),
                        ...include,
                    ],
                    options: {
                        cache: true,
                        formatter: require.resolve('react-dev-utils/eslintFormatter'),
                        eslintPath: require.resolve('eslint'),
                    },
                    loader: require.resolve('eslint-loader'),
                }, {
                    test: /\.(js|jsx)$/,
                    //exclude: /node_modules/,
                    include: [
                        path.join(context, 'src'),
                        ...include,
                    ],
                    use: [{
                        loader: "babel-loader",
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react'
                            ],
                            plugins: [
                                [
                                    require.resolve('babel-plugin-named-asset-import'),
                                    {
                                        loaderMap: {
                                            svg: {
                                                ReactComponent:
                                                    '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                                            },
                                        },
                                    },
                                ],
                            ],
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
                    test: /\.json$/,
                    exclude: /node_modules/,
                    loader: "json-loader"
                }, {
                    test: /\.html$/i,
                    exclude: [/node_modules/],
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
                    test: /\.json$/,
                    exclude: /node_modules/,
                    loader: "json-loader"
                },
                ...rules
            ],
        },
        performance: {...performance},
        resolve: {
            // options for resolving module requests
            // (does not apply to resolving to loaders)
            modules: [...resolve],
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
        plugins: [
            ...plugins
        ],
        externals: {...externals}
    };

    if(context) {
        //config.context = context;
    }

    if(splitChunks) {
        if(typeof splitChunks === 'boolean') {
            // Automatically split vendor and commons
            // https://twitter.com/wSokra/status/969633336732905474
            // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
            config.optimization.splitChunks = {
                chunks: 'all',
                name: false,
            };
            // Keep the runtime chunk separated to enable long term caching
            // https://twitter.com/wSokra/status/969679223278505985
            // https://github.com/facebook/create-react-app/issues/5358
            config.optimization.runtimeChunk = {
                name: entrypoint => `runtime-${entrypoint.name}`,
            };
        } else {
            config.optimization.splitChunks = splitChunks;
        }
    }

    if(devServer) {
        config.devServer = devServer;
    }

    if(devtool) {
        config.devtool = devtool;
    }

    /*const smp = new SpeedMeasurePlugin();
    return smp.wrap(config);*/
    return config;
}

function getPackageConfig(context, entry, dist, library, libraryTarget, resolve, externals) {
    const config = getConfig({
        context,
        mode: 'production',
        entry: {
            index: entry,
        },
        output: {
            filename: '[name].js',
            path: dist,
        },
        performance: {
            hints: 'warning',
            maxEntrypointSize: 500000,// 500kb
            maxAssetSize: 500000,
        },
        resolve,
        minimize: true,
        plugins: [
            new CleanWebpackPlugin(),
        ],
        externals,
        splitChunks: false,
    });

    if(library) {
        config.output.library = library;
    }
    if(libraryTarget) {
        config.output.libraryTarget = libraryTarget;
    } else {
        config.plugins.push(new EsmWebpackPlugin());
    }

    return config;
}

function getPackageBuilders(context, entry, dist, library, resolve, externals) {
    const builders = [];
    builders.push(getPackageConfig(context, entry, path.resolve(dist, 'lib'), library, 'commonjs', resolve, externals));
    builders.push(getPackageConfig(context, entry, path.resolve(dist, 'es'), library, false, resolve, externals));

    return builders;
}

const buildExternal = (common, amd) => {
    return {
        commonjs: common,
        commonjs2: common,
        amd: amd,
        root: amd
    };
};

exports.getConfig = getConfig;
exports.getPackageBuilders = getPackageBuilders;
exports.buildExternal = buildExternal;

'use strict';
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const CopyPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const {getConfig, commonBabelPlugins} = require('./webpack.common');
const path = require('path');

const babelPresets = [
    '@babel/preset-env',
    '@babel/preset-react',
];
const babelPlugins = [
    ...commonBabelPlugins,
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
];

const buildAppConfig = (main, dist, root, template) => ({
    entry: {
        vendors: ['react', 'react-dom'],
        main: main,
    },
    output: {
        filename: 'assets/[name].[hash:8].js',
        path: dist,
        chunkFilename: 'assets/[name].chunk.[hash:8].js',
        futureEmitAssets: true,
    },
    performance: {
        hints: false,
    },
    resolve: {
        // options for resolving module requests
        // (does not apply to resolving to loaders)
        // todo: make as strict as possible, only include needed ones
        modules: [
            path.resolve(root, 'node_modules'),
            "node_modules",
        ],
    },
    module: {
        rules: [{
            test: /\.(jpe?g|png|gif)$/i,
            exclude: /node_modules/,
            use: [
                'url-loader?limit=10000',
                'img-loader',
                'file-loader?name=[name].[ext]?[hash]'
            ]
        }, {
            // the following 3 rules handle font extraction
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff'
        }, {
            test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader'
        }, {
            test: /\.otf(\?.*)?$/,
            use: 'file-loader?name=/fonts/[name].[ext]&mimetype=application/font-otf'
        }, {
            loader: 'file-loader',
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|css|s[ac]ss|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
                name: 'assets/media/[name].[hash:8].[ext]',
            },
        },],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: false,
            cacheGroups: {
                default: false,
                vendors: false,
                vendor: {
                    chunks: 'all',
                    test: /node_modules/
                }
            }
        },
    },
    plugins: [
        new HtmlWebpackPlugin(
            Object.assign(
                {},
                {
                    inject: true,
                    template: template,
                },
                process.env.NODE_ENV === 'production' ? {
                        minify: {
                            removeComments: true,
                            collapseWhitespace: true,
                            removeRedundantAttributes: true,
                            useShortDoctype: true,
                            removeEmptyAttributes: true,
                            removeStyleLinkTypeAttributes: true,
                            keepClosingSlash: true,
                            minifyJS: true,
                            minifyCSS: true,
                            minifyURLs: true,
                        },
                    }
                    : undefined
            )
        ),

        // doesnt work with v4 of HtmlWebpackPlugin, but we need HtmlWebpackPlugin for the code splitting it seems
        //new InterpolateHtmlPlugin(HtmlWebpackPlugin, buildEnv(paths.demo.servedPath).raw),
    ],
});

/**
 * @param main
 * @param dist
 * @param root
 * @param template
 * @param publicPath
 * @param port
 * @param vendors
 * @param copy
 * @param packages
 * @return {{build: (function(): (function(...[*]=))|(function(): (*))), dist: *, serve: (function(): (function(...[*]=))|(function(): (*)))}}
 */
const buildAppPair = ({main, dist, root, template, publicPath, port, vendors = [], copy = []}, packages) => ({
    dist,
    serve: () => getConfig(
        merge(
            buildAppConfig(main, dist, root, template), {
                mode: 'development',
                entry: {
                    vendors,
                },
                resolve: {
                    alias: Object.values(packages).reduce((aliases, {name, entry}) => {
                        aliases[name] = entry
                        return aliases;
                    }, {})
                },
                devServer: {
                    contentBase: publicPath,
                    publicPath: '/',
                    compress: true,
                    inline: true,
                    hot: true,
                    historyApiFallback: true,
                    port: port,
                },
                optimization: {
                    runtimeChunk: 'single',
                    namedModules: true,
                },
                plugins: [
                    new CopyPlugin(copy),
                ],
                //devtool: 'eval-cheap-module-source-map',// faster rebuild, not for production
                devtool: 'cheap-module-source-map',// slow build, for production
            }
        ), {
            context: root,
            minimize: false,
            babelPlugins,
            babelPresets,
            include: [
                /*Object.values(packages).map(({root}) =>
                    path.resolve(root, 'es')
                ),*/
                Object.values(packages).map(({root}) =>
                    path.resolve(root, 'src')
                ),
            ],
        }
    ),
    build: () => getConfig(
        merge(
            buildAppConfig(main, dist, root, template), {
                mode: 'production',
                entry: {
                    vendors,
                },
                resolve: {
                    alias: Object.values(packages).reduce((aliases, {name, root}) => {
                        aliases[name] = root + '/build'
                        return aliases;
                    }, {})
                },
                optimization: {
                    runtimeChunk: 'single',
                },
                plugins: [
                    new CopyPlugin([
                        {from: publicPath, to: dist},
                        ...copy
                    ]),
                    // Inlines the webpack runtime script. This script is too small to warrant
                    // a network request.
                    // https://github.com/facebook/create-react-app/issues/5358
                    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/])
                ]
            }
        ), {
            context: root,
            minimize: true,
            babelPlugins,
            babelPresets,
        }
    )
});

exports.babelPresets = babelPresets;
exports.babelPlugins = babelPlugins;
exports.buildAppPair = buildAppPair;

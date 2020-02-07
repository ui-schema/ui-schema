'use strict';

const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const path = require('path');
const {getConfig} = require('./webpack.common');
const {buildEnv} = require('./tools');
const {paths, packMods, packEs, packSrc} = require('../config');

const demoCommon = {
    context: paths.demo.root,
    entry: {
        vendors: ['react', 'react-dom', 'react-error-boundary', 'immutable', '@material-ui/core', '@material-ui/icons'],
        main: paths.demo.main,
    },
    output: {
        filename: 'assets/[name].js',
        path: paths.demo.dist,
        chunkFilename: 'assets/[name].chunk.js',
        futureEmitAssets: true,
    },
    babelPresets: [
        '@babel/preset-env',
        '@babel/preset-react',
    ],
    babelPlugins: [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-transform-react-jsx",
        "@babel/plugin-transform-template-literals",
        "@babel/plugin-proposal-export-namespace-from",
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-runtime",
        "transform-es2015-template-literals",
        "es6-promise",
        "react-loadable/babel",
    ],
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
        use: 'file-loader?name=/fonts/[name].  [ext]&mimetype=application/font-otf'
    }],
    performance: {
        hints: false,
    },
    resolve: [
        path.resolve(paths.demo.root, 'node_modules'),
        "node_modules",
        ...packMods,
    ],
    plugins: [
        new HtmlWebpackPlugin(
            Object.assign(
                {},
                {
                    inject: true,
                    template: paths.demo.template,
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
    splitChunks: true,
    // todo: make adjustable by dev/prod
    devtool: 'eval-cheap-module-source-map',// faster rebuild, not for production
    // devtool: 'cheap-module-source-map',// slow build, for production
};

//
// Config for serving demo app with live-building packages
//

const demoServe = {...demoCommon};

demoServe.mode = 'development';
demoServe.minimize = false;
demoServe.plugins = [...demoCommon.plugins];// reference breaking
//demoServe.plugins.push(new webpack.HotModuleReplacementPlugin());
demoServe.devServer = {
    contentBase: paths.demo.public,
    compress: true,
    inline: true,
    hot: true,
    historyApiFallback: true,
    port: paths.demo.port
};

const demoServeConfig = getConfig(demoServe, [
    ...packEs,
    ...packSrc,
]);

demoServeConfig.optimization.runtimeChunk = "single";
demoServeConfig.optimization.namedModules = true;

exports.demoServe = demoServeConfig;

//
// Config for building demo app
//

const demoBuild = {...demoCommon};

demoBuild.mode = 'production';
demoBuild.minimize = true;
demoBuild.plugins = [...demoBuild.plugins];
// Inlines the webpack runtime script. This script is too small to warrant
// a network request.
// https://github.com/facebook/create-react-app/issues/5358
demoBuild.plugins.push(new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]));

const demoBuildConfig = getConfig(demoBuild);

demoBuildConfig.optimization.runtimeChunk = "single";
exports.demoBuild = demoBuildConfig;

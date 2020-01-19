'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const path = require('path');
const {getConfig} = require('./webpack.common');
const {paths} = require('../config');
const {env} = require('./webpack');

const packMods = Object.keys(paths.packages).map(pack => {
    return path.resolve(paths.packages[pack].root, 'node_modules');
});

const packSrc = Object.keys(paths.packages).map(pack => {
    return path.resolve(paths.packages[pack].root, 'src');
});

const demoCommon = {
    context: paths.demo.root,
    entry: {
        react: ["react", "react-dom"],
        main: paths.demo.main,
    },
    output: {
        filename: 'assets/[name].js',
        path: paths.demo.dist,
        chunkFilename: 'assets/[name].chunk.js',
        futureEmitAssets: true,
    },
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
        //new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    ],
    splitChunks: true,
    devtool: 'cheap-module-source-map',
};

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
    port: paths.demo.port
};

const demoServeConfig = getConfig(demoServe, packSrc);

//demoServeConfig.optimization.runtimeChunk = "single";
demoServeConfig.optimization.namedModules = true;

exports.demoServe = demoServeConfig;

const demoBuild = {...demoCommon};

demoBuild.mode = 'production';
demoBuild.minimize = true;
demoBuild.plugins = [...demoBuild.plugins];
// Inlines the webpack runtime script. This script is too small to warrant
// a network request.
// https://github.com/facebook/create-react-app/issues/5358
demoBuild.plugins.push(new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]));

const demoBuildConfig = getConfig(demoBuild, packSrc);
demoBuildConfig.optimization.runtimeChunk = "single";
exports.demoBuild = demoBuildConfig;

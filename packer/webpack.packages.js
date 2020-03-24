'use strict';

const path = require('path');
const {getConfig, commonBabelPlugins} = require('./webpack.common');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const babelPresets = [
    ['@babel/preset-react', {loose: true}],
];
const babelPlugins = [
    ...commonBabelPlugins,
    ['@babel/plugin-proposal-object-rest-spread', {useBuiltIns: true,},],
    ['@babel/plugin-proposal-class-properties', {loose: true}],
];

function getPackageBuilder(context, entry, dist, library, resolve, externals) {
    return getConfig({
        mode: 'production',
        entry: {index: entry},
        output: {
            filename: '[name].js',
            path: path.resolve(dist, 'build', 'cjs'),
            library,
            libraryTarget: 'umd',
        },
        performance: {
            hints: 'warning',
            // maxEntrypointSize: 500000,// 500kb
            maxEntrypointSize: 2000000,// 1000kb
            maxAssetSize: 2000000,
        },
        plugins: [
            new CleanWebpackPlugin(),
        ],
        externals,
        resolve: resolve ? {
            modules: resolve,
        } : undefined
    }, {
        context,
        babelPresets: [
            ['@babel/preset-env', {loose: true}],
            ...babelPresets,
        ],
        babelPlugin: [
            ...babelPlugins,
            '@babel/plugin-transform-modules-commonjs'
        ],
        minimize: false,
    });
}

const getPackagesConfig = (packages) => {
    const getPackagesConfig = [];

    Object.keys(packages).forEach(library => {
        let externals = {};

        if(packages[library].externals) {
            externals = {
                ...packages[library].externals
            }
        }

        getPackagesConfig.push(getPackageBuilder(
            packages[library].root,
            packages[library].entry,
            packages[library].root,
            library,
            [
                path.resolve(__dirname, '../', 'node_modules'),
                path.resolve(packages[library].root, 'node_modules'),
            ],
            {
                ...externals
            },
        ));
    });
    return getPackagesConfig;
}

exports.getPackagesConfig = getPackagesConfig;
exports.packagesBabelPresets = babelPresets;
exports.packagesBabelPlugins = babelPlugins;

exports.getPackagesRoot = packages => Object.keys(packages).map(pack => packages[pack].root);

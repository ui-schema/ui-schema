'use strict';

const path = require('path');
const {getConfig} = require('./webpack.common');
const {paths} = require('../config');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const babelPresets = [
    ['@babel/preset-react', {loose: true}],
];
const babelPlugins = [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-react-jsx",
    "@babel/plugin-transform-template-literals",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-export-default-from",
    ['@babel/plugin-proposal-object-rest-spread', {useBuiltIns: true,},],
    ['@babel/plugin-proposal-class-properties', {loose: true}],
];

function getPackageBuilders(context, entry, dist, library, resolve, externals) {
    const builders = [];
    builders.push(getConfig({
        mode: 'production',
        entry: {index: entry},
        output: {
            filename: '[name].js',
            path: path.resolve(dist, 'lib'),
            library,
            libraryTarget: 'umd',
        },
        performance: {
            hints: 'warning',
            // maxEntrypointSize: 500000,// 500kb
            maxEntrypointSize: 1000000,// 1000kb
            maxAssetSize: 1000000,
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
    }));

    return builders;
}

const packages = [];

Object.keys(paths.packages).forEach(library => {
    let externals = {};

    if(paths.packages[library].externals) {
        externals = {
            ...paths.packages[library].externals
        }
    }

    packages.push(...getPackageBuilders(
        paths.packages[library].root,
        paths.packages[library].entry,
        paths.packages[library].root,
        library,
        [
            path.resolve(__dirname, '../', 'node_modules'),
            path.resolve(paths.packages[library].root, 'node_modules'),
        ],
        {
            ...externals
        },
    ));
});

exports.packages = packages;
exports.packagesNames = Object.keys(paths.packages);
exports.packagesBabelPresets = babelPresets;
exports.packagesBabelPlugins = babelPlugins;

const packMods = Object.keys(paths.packages).map(pack => {
    return path.resolve(paths.packages[pack].root, 'node_modules');
});

const packEs = Object.keys(paths.packages).map(pack => {
    return path.resolve(paths.packages[pack].root, 'es');
});

const packSrc = Object.keys(paths.packages).map(pack => {
    return path.resolve(paths.packages[pack].root, 'src');
});

// todo: should be possible to get only paths for packages that the current app needs, `buildAppPair` is already prepared
exports.crossBuild = {
    modules: packMods,
    esModules: packEs,
    src: packSrc,
};

exports.packsRoot = Object.keys(paths.packages).map(pack => paths.packages[pack].root);

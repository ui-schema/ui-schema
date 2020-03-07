'use strict';

const path = require('path');
const {getConfig, commonBabelPlugins} = require('./webpack.common');
const {packages} = require('../config');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const babelPresets = [
    ['@babel/preset-react', {loose: true}],
];
const babelPlugins = [
    ...commonBabelPlugins,
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
    }));

    return builders;
}

const buildersPackages = [];

Object.keys(packages).forEach(library => {
    let externals = {};

    if(packages[library].externals) {
        externals = {
            ...packages[library].externals
        }
    }

    buildersPackages.push(...getPackageBuilders(
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

exports.buildersPackages = buildersPackages;
exports.packagesNames = Object.keys(packages);
exports.packagesBabelPresets = babelPresets;
exports.packagesBabelPlugins = babelPlugins;

const packMods = Object.keys(packages).map(pack => {
    return path.resolve(packages[pack].root, 'node_modules');
});

const packEs = Object.keys(packages).map(pack => {
    return path.resolve(packages[pack].root, 'es');
});

const packSrc = Object.keys(packages).map(pack => {
    return path.resolve(packages[pack].root, 'src');
});

// todo: should be possible to get only paths for packages that the current app needs, `buildAppPair` is already prepared
exports.crossBuild = {
    modules: packMods,
    esModules: packEs,
    src: packSrc,
};

exports.packsRoot = Object.keys(packages).map(pack => packages[pack].root);

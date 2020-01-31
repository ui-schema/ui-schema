'use strict';

const path = require('path');
const {getPackageConfig} = require('./webpack.common');
const {paths} = require('../config');
const {buildExternal} = require('./tools');

const defaultExternals = {
    react: buildExternal("react"),
    "react-dom": buildExternal("react-dom"),
};

const babelPresets = [
    ['@babel/preset-react', {loose: true}],
];
const babelPlugins = [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-react-jsx",
    "@babel/plugin-proposal-export-namespace-from",
    ['@babel/plugin-proposal-object-rest-spread', {useBuiltIns: true,},],
    ['@babel/plugin-proposal-class-properties', {loose: true}],
];

function getPackageBuilders(context, entry, dist, library, resolve, externals) {
    const builders = [];
    builders.push(getPackageConfig(context, entry, path.resolve(dist, 'lib'), false, false, resolve, externals, babelPresets, babelPlugins));
    //builders.push(getPackageConfig(context, entry, path.resolve(dist, 'lib'), library, false, resolve, externals, babelPresets, babelPlugins));
    return builders;
}

const packages = [];

Object.keys(paths.packages).forEach(pack => {
    let externals = {...defaultExternals};
    if(paths.packages[pack].externals) {
        externals = {
            ...defaultExternals,
            ...paths.packages[pack].externals
        }
    }

    packages.push(...getPackageBuilders(
        paths.packages[pack].root,
        paths.packages[pack].entry,
        paths.packages[pack].root,
        pack,
        [
            path.resolve(__dirname, '../', 'node_modules'),
            path.resolve(paths.packages[pack].root, 'node_modules'),
        ],
        {
            ...externals
        },
    ));
});

exports.packages = packages;
exports.packagesNames = Object.keys(paths.packages);
exports.buildExternal = buildExternal;
exports.babelPresets = babelPresets;
exports.babelPlugins = babelPlugins;

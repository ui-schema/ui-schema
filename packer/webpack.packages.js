'use strict';

const path = require('path');
const {getConfig, commonBabelPlugins} = require('./webpack.common');
const CopyPlugin = require('copy-webpack-plugin');
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
}

const getPackagesConfig = (packages) => {
    const getPackagesConfig = [];

    const alias = Object.values(packages).reduce((aliases, {name, root}) => {
        aliases[name] = root + '/build'
        return aliases;
    }, {});

    Object.keys(packages).forEach(library => {
        let externals = {};

        if(packages[library].externals) {
            externals = {
                ...packages[library].externals
            }
        }

        getPackagesConfig.push(getConfig({
            mode: 'production',
            entry: {index: packages[library].entry},
            /*output: {
                filename: '[name].js',
                path: path.resolve(packages[library].root, 'build', 'cjs'),
                library,
                libraryTarget: 'umd',
            },*/
            performance: {
                hints: 'warning',
                // maxEntrypointSize: 500000,// 500kb
                maxEntrypointSize: 2000000,// 1000kb
                maxAssetSize: 2000000,
            },
            plugins: [
                new CleanWebpackPlugin(),
                new CopyPlugin([
                    {
                        from: '**/*.d.ts',
                        to: path.resolve(packages[library].root, 'build/'),
                        context: path.resolve(packages[library].root, 'src'),
                    },
                ]),
            ],
            externals: externals,
            resolve: {
                modules: [
                    path.resolve(__dirname, '../', 'node_modules'),
                    path.resolve(packages[library].root, 'node_modules'),
                ],
                alias,
            }
        }, {
            context: packages[library].root,
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
    });
    return getPackagesConfig;
}

exports.getPackagesConfig = getPackagesConfig;
exports.packagesBabelPresets = babelPresets;
exports.packagesBabelPlugins = babelPlugins;

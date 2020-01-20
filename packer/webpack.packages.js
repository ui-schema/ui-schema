'use strict';

const path = require('path');
const {buildExternal, getPackageBuilders} = require('./webpack.common');
const {paths} = require('../config');

const externals = {
    react: buildExternal("commonjs react", "React"),
    "react-dom": buildExternal("commonjs react-dom", "ReactDOM"),
};

const packages = [];

Object.keys(paths.packages).forEach(pack => {
    let extern = {...externals};
    if(paths.packages[pack].externals) {
        extern = {
            ...externals,
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
            ...extern
        },
    ));
});

exports.packages = packages;
exports.packagesNames = Object.keys(paths.packages);
exports.buildExternal = buildExternal;

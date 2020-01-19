'use strict';

const path = require('path');
const {buildExternal, getPackageBuilders} = require('./webpack.common');
const {paths} = require('../config');

const externals = {
    react: buildExternal("react", "React"),
    "react-dom": buildExternal("react-dom", "ReactDOM"),
};

const packages = [];

Object.keys(paths.packages).forEach(pack => {
    let ex = {...externals};
    if(paths.packages[pack].externals) {
        ex = {
            ...externals,
            ...paths.packages[pack].externals
        }
    }

    packages.push(...getPackageBuilders(
        paths.packages[pack].root,
        paths.packages[pack].main,
        paths.packages[pack].root,
        pack,
        [
            'node_modules',
            path.resolve(paths.packages[pack].root, 'node_modules'),
        ],
        {
            ...ex
        },
    ));
});

exports.packages = packages;
exports.packagesNames = Object.keys(paths.packages);
exports.buildExternal = buildExternal;

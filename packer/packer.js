const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const {paths, packRoot} = require('../config');
const {startWebpack} = require('./webpack');
const symlinkDir = require('symlink-dir');
const {packages, packagesNames} = require('./webpack.packages');
const {demoBuild, demoServe} = require('./webpack.demo');

if(-1 !== process.argv.indexOf('--serve')) {
    // when serve is used it only uses the demo dev-server which also bundles the packages
    packRoot.forEach(pack => {
        let pack_es = path.resolve(pack, 'es');
        let pack_src = path.resolve(pack, 'src');
        if(!fs.existsSync(pack_es)) {
            symlinkDir(pack_src, pack_es)
                .then(() => console.log('pack symlinked! from: ', pack_src, ' to: ', pack_es))
                .catch(err => console.error(err));
        }
    });

    startWebpack(demoServe);
} else if(-1 !== process.argv.indexOf('--clean')) {
    // clean dists
    const promises = [];

    const delDir = dir => promises.push(new Promise(((resolve, reject) => {
        if(fs.existsSync(dir)) {
            console.log('deleting', dir);
            rimraf(dir, () => {
                console.log('deleted', dir);
                resolve();
            });
        } else {
            resolve();
        }
    })));

    delDir(paths.demo.dist);

    packRoot.forEach(pack => {
        let pack_mod = path.resolve(pack, 'lib');
        delDir(pack_mod);
        let pack_commonjs = path.resolve(pack, 'es');
        delDir(pack_commonjs);
        Promise.all(promises)
            .then((e) => e.length === promises.length ? console.log('deleted all dists!') : undefined);
    });
} else {
    // production build

    // combine configs to build packages and demo
    const configs = [...packages];
    configs.push(demoBuild);

    configs.forEach((c) => {
        // check created webpack configs
        // console.log(c.module.rules);
        // console.log(Object.keys(c.entry));
    });

    console.log('Starting build for `demo` and ' + packagesNames.length + ' packs: `' + packagesNames.join(', ') + '`');

    startWebpack(configs);
}

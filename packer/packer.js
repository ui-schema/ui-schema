const fs = require('fs');
const path = require('path');
const {delDir} = require('./tools');
const {paths, packRoot} = require('../config');
const {buildEsModules} = require('./babel');
const {buildWebpack, serveWebpack} = require('./webpack');
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
                .catch(err => {
                    console.error('pack symlink error', err);
                    process.exit(1);
                });
        }
    });

    serveWebpack(demoServe);
} else if(-1 !== process.argv.indexOf('--clean')) {
    // clean dists

    // todo: a `lerna bootstrap --hoist` is needed afterwards, rimraf seems to break node_modules symlinking
    const promises = [];

    promises.push(delDir(paths.demo.dist));

    packRoot.forEach(pack => {
        let pack_mod = path.resolve(pack, 'lib');
        promises.push(delDir(pack_mod));
        let pack_es = path.resolve(pack, 'es');
        promises.push(delDir(pack_es));

        Promise.all(promises)
            .then((e) => e.length === promises.length ?
                promises.length ? console.log('deleted all dists!') : console.log('no dists exists.')
                : undefined);
    });
} else {
    // production build

    console.log('Production build for `demo` and ' + packagesNames.length + ' packs: `' + packagesNames.join(', ') + '`');

    console.log('');
    console.log('Starting ES6 build for ' + packagesNames.length + ' packs: `' + packagesNames.join(', ') + '`');
    buildEsModules(paths.packages)
        .then(() => {
            console.log('');
            console.log('Starting webpack build for `demo` and ' + packagesNames.length + ' packs: `' + packagesNames.join(', ') + '`');
            // combine configs to build packages and demo
            const configs = [...packages];
            configs.push(demoBuild);

            configs.forEach((c) => {
                // check created webpack configs, e.g.:
                // console.log(c.module.rules);
                // console.log(Object.keys(c.entry));
            });
            buildWebpack(configs);
        })
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

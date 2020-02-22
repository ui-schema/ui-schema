const fs = require('fs');
const path = require('path');
const {delDir} = require('./tools');
const {paths} = require('../config');
const {buildEsModules} = require('./babel');
const {buildWebpack, serveWebpack} = require('./webpack');
const symlinkDir = require('symlink-dir');
const {packsRoot, packages, packagesNames} = require('./webpack.packages');
const {apps} = require('./webpack.apps');
const argv = require('minimist')(process.argv.slice(2));

const serveId = argv['serve'] === true ? 'demo' : (argv['serve'] || false);
const doClean = !!argv['clean'];
const doBuild = !!argv['build'];

if(doClean) {
    // clean dists

    // todo: a `lerna bootstrap --hoist` is needed afterwards, rimraf seems to break node_modules symlinking
    const promises = [];

    // todo: all apps automatic
    promises.push(delDir(paths.demo.dist));

    // todo: lib/es should be like configured
    packsRoot.forEach(pack => {
        let pack_mod = path.resolve(pack, 'lib');
        promises.push(delDir(pack_mod));
        let pack_es = path.resolve(pack, 'es');
        promises.push(delDir(pack_es));

        Promise.all(promises)
            .then((e) => e.length === promises.length ?
                promises.length ? console.log('deleted all dists!') : console.log('no dists exists.')
                : undefined);
    });
}

if(doBuild) {
    // production build
    console.log('Production build for apps: `' + (Object.keys(apps).join(', ')) + '` and ' + packagesNames.length + ' modules: `' + packagesNames.join(', ') + '`');

    console.log('');
    console.log('Starting ES6 build for ' + packagesNames.length + ' modules: `' + packagesNames.join(', ') + '`');
    buildEsModules(paths.packages)
        .then(() => {
            console.log('');
            console.log('Starting webpack build for apps `' + (Object.keys(apps).join(', ')) + '` and ' + packagesNames.length + ' modules: `' + packagesNames.join(', ') + '`');
            // combine configs to build packages and demo
            const configs = [...packages];
            for(let app in apps) {
                if(!apps[app].build) {
                    console.error('App has no serve config: ', app);
                    process.exit(1);
                }

                if(typeof apps[app].build === 'function') {
                    apps[app].build = apps[app].build();
                }

                if(typeof apps[app].build !== 'object') {
                    console.error('App has invalid serve config: ', app, apps[app].build);
                    process.exit(1);
                }

                configs.push(apps[app].build);
            }

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

if(serveId) {
    if(!apps[serveId]) {
        console.error('App not existing: ' + serveId, 'Existing Apps:', Object.keys(apps));
        process.exit(1);
    }
    if(!apps[serveId].serve) {
        console.error('App has no serve config: ', serveId);
        process.exit(1);
    }

    if(typeof apps[serveId].serve === 'function') {
        apps[serveId].serve = apps[serveId].serve();
    }

    if(typeof apps[serveId].serve !== 'object') {
        console.error('App has invalid serve config: ', serveId, apps[serveId].serve);
        process.exit(1);
    }

    console.log('Starting App `' + serveId + '`:');

    // when serve is used it only uses the demo dev-server which also bundles the packages, but their `es` type must be exporter
    packsRoot.forEach(pack => {
        let pack_es = path.resolve(pack, 'es');
        let pack_src = path.resolve(pack, 'src');// symlinking src to have better IDE autocomplete support, `es` should be excluded from autocomplete
        if(!fs.existsSync(pack_es)) {
            symlinkDir(pack_src, pack_es)
                .then(() => console.log('pack symlinked! from: ', pack_src, ' to: ', pack_es))
                .catch(err => {
                    console.error('pack symlink error', err);
                    process.exit(1);
                });
        }
    });

    serveWebpack(apps[serveId].serve);
}

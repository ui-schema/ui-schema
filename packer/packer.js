const {startWebpack} = require('./webpack');
const {packages, packagesNames} = require('./webpack.packages');
const {demoBuild, demoServe} = require('./webpack.demo');

if(-1 !== process.argv.indexOf('--serve')) {
    // when serve is used it only uses the demo dev-server which also bundles the packages

    startWebpack(demoServe);
} else {
    // production build

    // combine configs to build packages and demo
    const configs = [...packages];
    configs.push(demoBuild);

    console.log('Starting build for `demo` and ' + packagesNames.length + ' packs: `' + packagesNames.join(', ') + '`');
    startWebpack(configs);
}

'use strict';

const {paths,} = require('../config');
const {buildAppPair} = require('./webpack.app_common');

//
// Config for serving and building apps that are capable of
// - serve cross-build react in packages
// - building the apps separately - needs pre-build packages
//

const apps = {
    demo: buildAppPair(paths.demo.main, paths.demo.dist, paths.demo.root, paths.demo.template, paths.demo.public,paths.demo.port)
};

exports.apps = apps;

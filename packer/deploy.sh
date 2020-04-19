#!/bin/bash

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >.npmrc

# todo: not manual resetting the file here
git checkout -- packages/webpackPartialConfig.js

npm run release
#npm run release -- --yes

rm .npmrc

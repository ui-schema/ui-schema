#!/bin/bash

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >.npmrc

# todo: not manual resetting the file here
git checkout -- packages/webpackPartialConfig.js

cd ./packages

cd ui-schema
cp package.json build/ && cp package-lock.json build/ &&  cp README.md build/ && npm publish build
cd ../

cd ds-bootstrap
cp package.json build/ && cp package-lock.json build/ &&  cp README.md build/ && npm publish build
cd ../

cd ds-material
cp package.json build/ && cp package-lock.json build/ &&  cp README.md build/ && npm publish build
cd ../

cd material-code
cp package.json build/ && cp package-lock.json build/ &&  cp README.md build/ && npm publish build
cd ../

cd material-color
cp package.json build/ && cp package-lock.json build/ &&  cp README.md build/ && npm publish build
cd ../

cd material-pickers
cp package.json build/ && cp package-lock.json build/ &&  cp README.md build/ && npm publish build
cd ../

cd material-richtext
cp package.json build/ && cp package-lock.json build/ &&  cp README.md build/ && npm publish build
cd ../

#npm run release
#npm run release -- --yes

rm .npmrc

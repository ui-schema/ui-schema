#!/bin/bash

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >.npmrc

echo "Token length: ${#NPM_TOKEN}"

# todo: not manual resetting the file here
git checkout -- packages/webpackPartialConfig.js

cd ./packages

cd ui-schema
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd ui-schema-pro
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd dictionary
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd ds-bootstrap
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd ds-material
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd kit-dnd
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd material-code
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd material-color
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd material-dnd
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd material-editable
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd material-editorjs
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd material-pickers
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd material-richtext
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd material-slate
cp package.json build/ && cp package-lock.json build/ && cp README.md build/
cd ../

cd ../

#npm run release
npm run release -- --yes

rm .npmrc

#!/bin/bash

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >.npmrc

#echo "Token length: ${#NPM_TOKEN}"

cd ./packages

cd dictionary
cp README.md build/ && cp ../../LICENSE build/
cd ../

cd ds-bootstrap
cp README.md build/ && cp ../../LICENSE build/
cd ../

cd ds-material
cp README.md build/ && cp ../../LICENSE build/
cd ../

cd json-pointer
cp README.md build/ && cp ../../LICENSE build/
cd ../

cd json-schema
cp README.md build/ && cp ../../LICENSE build/
cd ../

cd kit-dnd
cp README.md build/ && cp ../../LICENSE build/
cd ../

cd material-dnd
cp README.md build/ && cp ../../LICENSE build/
cd ../

cd material-pickers
cp README.md build/ && cp ../../LICENSE build/
cd ../

cd pro
cp README.md build/ && cp ../../LICENSE build/
cd ../

cd react
cp README.md build/ && cp ../../LICENSE build/
cd ../

cd react-json-schema
cp README.md build/ && cp ../../LICENSE build/
cd ../

cd ui-schema
cp README.md build/ && cp ../../LICENSE build/
cd ../

cd ../

#npm run release
npm run release -- --yes

rm .npmrc

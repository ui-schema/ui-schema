#!/bin/bash

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >.npmrc

npm whoami

npm run release -- --yes

rm .npmrc

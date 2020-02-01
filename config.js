const path = require('path');
const {buildExternal} = require('./packer/tools');

const paths = {
    demo: {
        root: path.resolve(__dirname, 'packages', 'demo'),
        template: path.resolve(__dirname, 'packages', 'demo/public/index.html'),
        public: path.resolve(__dirname, 'packages', 'demo/public'),
        port: 4200,
        main: path.resolve(__dirname, 'packages', 'demo/src/index.js'),
        dist: path.resolve(__dirname, 'dist', 'demo'),
        servedPath: '/'// todo: make package.json homepage dependent
    },
    packages: {
        // the keys are the commonjs names that is applied to externals
        // this is the same as `@babel/plugin-transform-modules-commonjs` applies
        uiSchema: {
            root: path.resolve(__dirname, 'packages', 'ui-schema'),
            entry: path.resolve(__dirname, 'packages', 'ui-schema/src/'),
        },
        dsMaterial: {
            root: path.resolve(__dirname, 'packages', 'ds-material'),
            entry: path.resolve(__dirname, 'packages', 'ds-material/src/'),
            externals: {
                "@ui-schema/ui-schema": buildExternal("@ui-schema/ui-schema"),
                "@material-ui/core": buildExternal("@material-ui/core"),
                "@material-ui/icons": buildExternal("@material-ui/icons"),
            }
        },
    }
};

exports.paths = paths;

const packMods = Object.keys(paths.packages).map(pack => {
    return path.resolve(paths.packages[pack].root, 'node_modules');
});

const packEs = Object.keys(paths.packages).map(pack => {
    return path.resolve(paths.packages[pack].root, 'es');
});

const packSrc = Object.keys(paths.packages).map(pack => {
    return path.resolve(paths.packages[pack].root, 'src');
});

const packRoot = Object.keys(paths.packages).map(pack => paths.packages[pack].root);

exports.packMods = packMods;
exports.packEs = packEs;
exports.packSrc = packSrc;
exports.packRoot = packRoot;

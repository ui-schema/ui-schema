const path = require('path');
const {buildExternal} = require('./packer/webpack.common');
const {spawn} = require('cross-spawn');

const paths = {
    demo: {
        root: path.resolve(__dirname, 'packages', 'demo'),
        template: path.resolve(__dirname, 'packages', 'demo/public/index.html'),
        public: path.resolve(__dirname, 'packages', 'demo/public'),
        port: 4200,
        main: path.resolve(__dirname, 'packages', 'demo/src/index.js'),
        dist: path.resolve(__dirname, 'dist', 'demo'),
        servedPath: '/'// todo: make homepage dependent
    },
    packages: {
        uiSchema: {
            root: path.resolve(__dirname, 'packages', 'ui-schema'),
            entry: path.resolve(__dirname, 'packages', 'ui-schema/src/'),
        },
        dsMaterial: {
            root: path.resolve(__dirname, 'packages', 'ds-material'),
            entry: path.resolve(__dirname, 'packages', 'ds-material/src/'),
            externals: {
                "@ui-schema/ui-schema": buildExternal("commonjs @ui-schema/ui-schema", "UISchema"),
                "@material-ui/core": buildExternal("commonjs @material-ui/core", "MaterialUiCore"),
                "@material-ui/icons": buildExternal("commonjs @material-ui/icons", "MaterialUiIcons"),
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

const spawnBabel = (args) => {
    return spawn(require.resolve('./node_modules/.bin/babel'), args, {stdio: 'inherit'});
};

exports.packMods = packMods;
exports.packEs = packEs;
exports.packSrc = packSrc;
exports.packRoot = packRoot;
exports.spawnBabel = spawnBabel;

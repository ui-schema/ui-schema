const path = require('path');
const {buildExternal} = require('./packer/webpack.common');

exports.paths = {
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
        dsMaterial: {
            root: path.resolve(__dirname, 'packages', 'ds-material'),
            main: path.resolve(__dirname, 'packages', 'ds-material/src/index.js'),
            externals: {
                "@material-ui/core": buildExternal("material-ui-core", "MaterialUiCore"),
                "@material-ui/icons": buildExternal("material-ui-icons", "MaterialUiIcons"),
            }
        },
        uiSchema: {
            root: path.resolve(__dirname, 'packages', 'ui-schema'),
            main: path.resolve(__dirname, 'packages', 'ui-schema/src/index.js'),
        }
    }
};

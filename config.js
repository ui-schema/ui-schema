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
            react: buildExternal("react"),
            "react-dom": buildExternal("react-dom"),
        },
        dsMaterial: {
            root: path.resolve(__dirname, 'packages', 'ds-material'),
            entry: path.resolve(__dirname, 'packages', 'ds-material/src/'),
            externals: {
                "@ui-schema/ui-schema": buildExternal("@ui-schema/ui-schema"),
                "@material-ui/core": buildExternal("@material-ui/core"),
                "@material-ui/icons": buildExternal("@material-ui/icons"),
                react: buildExternal("react"),
                "react-dom": buildExternal("react-dom"),
            }
        },
        dsBootstrap: {
            root: path.resolve(__dirname, 'packages', 'ds-bootstrap'),
            entry: path.resolve(__dirname, 'packages', 'ds-bootstrap/src/'),
            externals: {
                "@ui-schema/ui-schema": buildExternal("@ui-schema/ui-schema"),
                react: buildExternal("react"),
                "react-dom": buildExternal("react-dom"),
            }
        },
    }
};

exports.paths = paths;

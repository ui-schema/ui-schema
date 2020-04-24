const path = require('path');
const {buildExternal} = require('./packer/tools');

const apps = {
    demo: {
        root: path.resolve(__dirname, 'packages', 'demo'),
        template: path.resolve(__dirname, 'packages', 'demo/public/index.html'),
        publicPath: path.resolve(__dirname, 'packages', 'demo/public'),// dev-server
        port: 4200,
        main: path.resolve(__dirname, 'packages', 'demo/src/index.js'),
        dist: path.resolve(__dirname, 'dist', 'demo'),
        servedPath: '/',// todo: make package.json homepage dependent,
        vendors: ['react-error-boundary', 'immutable', '@material-ui/core', '@material-ui/icons'],
    },
    docs: {
        root: path.resolve(__dirname, 'packages', 'docs'),
        template: path.resolve(__dirname, 'packages', 'docs/public/index.html'),
        publicPath: path.resolve(__dirname, 'packages', 'docs/public'),// dev-server
        port: 4201,
        main: path.resolve(__dirname, 'packages', 'docs/src/index.js'),
        dist: path.resolve(__dirname, 'dist', 'docs'),
        servedPath: '/',
        vendors: ['react-error-boundary', 'immutable', '@material-ui/core', '@material-ui/icons'],
        copy: [{from: path.resolve(__dirname, 'schema'), to: path.resolve(__dirname, 'dist', 'docs', 'schema')}]
    }
};

const packages = {
    // the keys are the commonjs names that is applied to externals
    // this is the same as `@babel/plugin-transform-modules-commonjs` applies
    uiSchema: {
        name: '@ui-schema/ui-schema',
        root: path.resolve(__dirname, 'packages', 'ui-schema'),
        entry: path.resolve(__dirname, 'packages', 'ui-schema/src/'),
        react: buildExternal("react"),
        "react-dom": buildExternal("react-dom"),
    },
    dsMaterial: {
        // noClean: true,
        name: '@ui-schema/ds-material',
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
        name: '@ui-schema/ds-bootstrap',
        root: path.resolve(__dirname, 'packages', 'ds-bootstrap'),
        entry: path.resolve(__dirname, 'packages', 'ds-bootstrap/src/'),
        externals: {
            "@ui-schema/ui-schema": buildExternal("@ui-schema/ui-schema"),
            react: buildExternal("react"),
            "react-dom": buildExternal("react-dom"),
        }
    },
    materialPickers: {
        name: '@ui-schema/material-pickers',
        root: path.resolve(__dirname, 'packages', 'material-pickers'),
        entry: path.resolve(__dirname, 'packages', 'material-pickers/src/'),
        externals: {
            "@ui-schema/ui-schema": buildExternal("@ui-schema/ui-schema"),
            "@ui-schema/ds-material": buildExternal("@ui-schema/ds-material"),
            "@material-ui/core": buildExternal("@material-ui/core"),
            "@material-ui/icons": buildExternal("@material-ui/icons"),
            react: buildExternal("react"),
            "react-dom": buildExternal("react-dom"),
        }
    },
    materialRichtext: {
        name: '@ui-schema/material-richtext',
        root: path.resolve(__dirname, 'packages', 'material-richtext'),
        entry: path.resolve(__dirname, 'packages', 'material-richtext/src/'),
        externals: {
            "@ui-schema/ui-schema": buildExternal("@ui-schema/ui-schema"),
            "@ui-schema/ds-material": buildExternal("@ui-schema/ds-material"),
            "@material-ui/core": buildExternal("@material-ui/core"),
            "@material-ui/icons": buildExternal("@material-ui/icons"),
            react: buildExternal("react"),
            "react-dom": buildExternal("react-dom"),
            draftJs: buildExternal("draft-js"),
            draftJsPluginsEditor: buildExternal("draft-js-plugins-editor"),
        }
    },
    materialCode: {
        name: '@ui-schema/material-code',
        root: path.resolve(__dirname, 'packages', 'material-code'),
        entry: path.resolve(__dirname, 'packages', 'material-code/src/'),
        externals: {
            "@ui-schema/ui-schema": buildExternal("@ui-schema/ui-schema"),
            "@ui-schema/ds-material": buildExternal("@ui-schema/ds-material"),
            "@material-ui/core": buildExternal("@material-ui/core"),
            "@material-ui/icons": buildExternal("@material-ui/icons"),
            react: buildExternal("react"),
            "react-dom": buildExternal("react-dom"),
            reactCodemirror2: buildExternal("react-codemirror2"),
            codemirror: buildExternal("codemirror"),
        }
    },
    materialColor: {
        name: '@ui-schema/material-color',
        root: path.resolve(__dirname, 'packages', 'material-color'),
        entry: path.resolve(__dirname, 'packages', 'material-color/src/'),
        externals: {
            "@ui-schema/ui-schema": buildExternal("@ui-schema/ui-schema"),
            "@ui-schema/ds-material": buildExternal("@ui-schema/ds-material"),
            "@material-ui/core": buildExternal("@material-ui/core"),
            "@material-ui/icons": buildExternal("@material-ui/icons"),
            react: buildExternal("react"),
            "react-dom": buildExternal("react-dom"),
            materialUiColorPicker: buildExternal("material-ui-color-picker")
        }
    },
};


const packer = require('./packer/packer')

packer(apps, packages)


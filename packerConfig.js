const path = require('path');
const {buildExternal, packer} = require('lerna-packer');

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
        copy: [{from: path.resolve(__dirname, 'schema'), to: path.resolve(__dirname, 'dist', 'docs', 'schema')}],
    },
};

const packages = {
    // the keys are the commonjs names that is applied to externals
    // this is the same as `@babel/plugin-transform-modules-commonjs` applies
    uiSchema: {
        name: '@ui-schema/ui-schema',
        root: path.resolve(__dirname, 'packages', 'ui-schema'),
        entry: path.resolve(__dirname, 'packages', 'ui-schema/src/'),
        externals: {
            react: buildExternal('react'),
            immutable: buildExternal('immutable'),
            'react-dom': buildExternal('react-dom'),
        },
    },
    uiSchemaPro: {
        name: '@ui-schema/pro',
        root: path.resolve(__dirname, 'packages', 'ui-schema-pro'),
        entry: path.resolve(__dirname, 'packages', 'ui-schema-pro/src/'),
        externals: {
            react: buildExternal('react'),
            immutable: buildExternal('immutable'),
            'react-dom': buildExternal('react-dom'),
            '@ui-schema/ui-schema': buildExternal('@ui-schema/ui-schema'),
        },
    },
    uiSchemaDictionary: {
        name: '@ui-schema/dictionary',
        root: path.resolve(__dirname, 'packages', 'dictionary'),
        entry: path.resolve(__dirname, 'packages', 'dictionary/src/'),
        externals: {
            immutable: buildExternal('immutable'),
            '@ui-schema/ui-schema': buildExternal('@ui-schema/ui-schema'),
        },
    },
    dsMaterial: {
        // noClean: true,
        name: '@ui-schema/ds-material',
        root: path.resolve(__dirname, 'packages', 'ds-material'),
        entry: path.resolve(__dirname, 'packages', 'ds-material/src/'),
        externals: {
            '@ui-schema/ui-schema': buildExternal('@ui-schema/ui-schema'),
            '@material-ui/core': buildExternal('@material-ui/core'),
            '@material-ui/icons': buildExternal('@material-ui/icons'),
            react: buildExternal('react'),
            'react-dom': buildExternal('react-dom'),
            immutable: buildExternal('immutable'),
        },
    },
    dsBootstrap: {
        name: '@ui-schema/ds-bootstrap',
        root: path.resolve(__dirname, 'packages', 'ds-bootstrap'),
        entry: path.resolve(__dirname, 'packages', 'ds-bootstrap/src/'),
        externals: {
            '@ui-schema/ui-schema': buildExternal('@ui-schema/ui-schema'),
            react: buildExternal('react'),
            'react-dom': buildExternal('react-dom'),
            immutable: buildExternal('immutable'),
        },
    },
    materialPickers: {
        name: '@ui-schema/material-pickers',
        root: path.resolve(__dirname, 'packages', 'material-pickers'),
        entry: path.resolve(__dirname, 'packages', 'material-pickers/src/'),
        externals: {
            '@ui-schema/ui-schema': buildExternal('@ui-schema/ui-schema'),
            '@ui-schema/ds-material': buildExternal('@ui-schema/ds-material'),
            '@material-ui/core': buildExternal('@material-ui/core'),
            '@material-ui/icons': buildExternal('@material-ui/icons'),
            react: buildExternal('react'),
            'react-dom': buildExternal('react-dom'),
            immutable: buildExternal('immutable'),
        },
    },
    materialRichtext: {
        name: '@ui-schema/material-richtext',
        root: path.resolve(__dirname, 'packages', 'material-richtext'),
        entry: path.resolve(__dirname, 'packages', 'material-richtext/src/'),
        externals: {
            '@ui-schema/ui-schema': buildExternal('@ui-schema/ui-schema'),
            '@ui-schema/ds-material': buildExternal('@ui-schema/ds-material'),
            '@material-ui/core': buildExternal('@material-ui/core'),
            '@material-ui/icons': buildExternal('@material-ui/icons'),
            react: buildExternal('react'),
            'react-dom': buildExternal('react-dom'),
            immutable: buildExternal('immutable'),
            draftJs: buildExternal('draft-js'),
            draftJsPluginsEditor: buildExternal('draft-js-plugins-editor'),
        },
    },
    materialCode: {
        name: '@ui-schema/material-code',
        root: path.resolve(__dirname, 'packages', 'material-code'),
        entry: path.resolve(__dirname, 'packages', 'material-code/src/'),
        externals: {
            '@ui-schema/ui-schema': buildExternal('@ui-schema/ui-schema'),
            '@ui-schema/ds-material': buildExternal('@ui-schema/ds-material'),
            '@material-ui/core': buildExternal('@material-ui/core'),
            '@material-ui/icons': buildExternal('@material-ui/icons'),
            react: buildExternal('react'),
            'react-dom': buildExternal('react-dom'),
            immutable: buildExternal('immutable'),
            reactCodemirror2: buildExternal('react-codemirror2'),
            codemirror: buildExternal('codemirror'),
        },
    },
    materialColor: {
        name: '@ui-schema/material-color',
        root: path.resolve(__dirname, 'packages', 'material-color'),
        entry: path.resolve(__dirname, 'packages', 'material-color/src/'),
        externals: {
            '@ui-schema/ui-schema': buildExternal('@ui-schema/ui-schema'),
            '@ui-schema/ds-material': buildExternal('@ui-schema/ds-material'),
            '@material-ui/core': buildExternal('@material-ui/core'),
            '@material-ui/icons': buildExternal('@material-ui/icons'),
            react: buildExternal('react'),
            'react-dom': buildExternal('react-dom'),
            immutable: buildExternal('immutable'),
            materialUiColorPicker: buildExternal('material-ui-color-picker'),
        },
    },
    materialEditorJs: {
        name: '@ui-schema/material-editorjs',
        root: path.resolve(__dirname, 'packages', 'material-editorjs'),
        entry: path.resolve(__dirname, 'packages', 'material-editorjs/src/'),
        externals: {
            '@ui-schema/ui-schema': buildExternal('@ui-schema/ui-schema'),
            '@ui-schema/ds-material': buildExternal('@ui-schema/ds-material'),
            '@material-ui/core': buildExternal('@material-ui/core'),
            '@material-ui/icons': buildExternal('@material-ui/icons'),
            react: buildExternal('react'),
            'react-dom': buildExternal('react-dom'),
            immutable: buildExternal('immutable'),
            'react-editor-js': buildExternal('react-editor-js'),
            '@editorjs/editorjs': buildExternal('@editorjs/editorjs'),
        },
    },
    materialDnd: {
        name: '@ui-schema/material-dnd',
        root: path.resolve(__dirname, 'packages', 'material-dnd'),
        entry: path.resolve(__dirname, 'packages', 'material-dnd/src/'),
        externals: {
            '@ui-schema/ui-schema': buildExternal('@ui-schema/ui-schema'),
            '@ui-schema/ds-material': buildExternal('@ui-schema/ds-material'),
            '@material-ui/core': buildExternal('@material-ui/core'),
            '@material-ui/icons': buildExternal('@material-ui/icons'),
            react: buildExternal('react'),
            'react-dom': buildExternal('react-dom'),
            immutable: buildExternal('immutable'),
            'react-dnd': buildExternal('react-dnd'),
        },
    },
    materialRbd: {
        name: '@ui-schema/material-rbd',
        root: path.resolve(__dirname, 'packages', 'material-rbd'),
        entry: path.resolve(__dirname, 'packages', 'material-rbd/src/'),
        externals: {
            '@ui-schema/ui-schema': buildExternal('@ui-schema/ui-schema'),
            '@ui-schema/ds-material': buildExternal('@ui-schema/ds-material'),
            '@material-ui/core': buildExternal('@material-ui/core'),
            '@material-ui/icons': buildExternal('@material-ui/icons'),
            react: buildExternal('react'),
            'react-dom': buildExternal('react-dom'),
            immutable: buildExternal('immutable'),
            'react-beautiful-dnd': buildExternal('react-beautiful-dnd'),
        },
    },
};

packer(apps, packages, __dirname);

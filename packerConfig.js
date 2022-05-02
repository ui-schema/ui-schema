const path = require('path');
const {packer, webpack} = require('lerna-packer');

packer({
    apps: {
        demo: {
            root: path.resolve(__dirname, 'packages', 'demo'),
            template: path.resolve(__dirname, 'packages', 'demo/public/index.html'),
            contentBase: path.resolve(__dirname, 'packages', 'demo/public'),// dev-server
            port: 4200,
            main: path.resolve(__dirname, 'packages', 'demo/src/index.js'),
            dist: path.resolve(__dirname, 'dist', 'demo'),
            devServer: {
                client: {
                    overlay: false,
                    progress: false,
                },
            },
            publicPath: '/',
            vendors: ['react-error-boundary', 'immutable', '@mui/material', '@mui/icons-material'],
            // plugins: [],
        },
        pickersDemo: {
            root: path.resolve(__dirname, 'packages', 'material-pickers'),
            rootSrc: 'demo/src',
            template: path.resolve(__dirname, 'packages', 'material-pickers/demo/public/index.html'),
            contentBase: path.resolve(__dirname, 'packages', 'material-pickers/demo/public'),// dev-server
            port: 4202,
            main: path.resolve(__dirname, 'packages', 'material-pickers/demo/src/index.tsx'),
            dist: path.resolve(__dirname, 'dist', 'pickers-demo'),
            devServer: {
                client: {
                    overlay: false,
                    progress: false,
                },
            },
            publicPath: '/',
            // vendors: ['react-error-boundary', 'immutable', '@mui/material', '@mui/icons-material'],
            // plugins: [],
        },
        docs: {
            root: path.resolve(__dirname, 'packages', 'docs'),
            template: path.resolve(__dirname, 'packages', 'docs/public/index.html'),
            contentBase: path.resolve(__dirname, 'packages', 'docs/public'),// dev-server
            port: 4201,
            main: path.resolve(__dirname, 'packages', 'docs/src/index.tsx'),
            dist: path.resolve(__dirname, 'dist', 'docs'),
            publicPath: '/',
            devServer: {
                client: {
                    overlay: false,
                    progress: false,
                },
                historyApiFallback: {
                    disableDotRule: true,
                },
            },
            vendors: ['react-error-boundary', 'immutable', '@mui/material', '@mui/icons-material'],
            copy: [{from: path.resolve(__dirname, 'schema'), to: path.resolve(__dirname, 'dist', 'docs', 'schema')}],
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                    'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_ENV),
                    'process.env.REACT_APP_G_TAG': JSON.stringify(process.env.REACT_APP_G_TAG || 'G-0PGCF34TJK'),
                }),
            ],
            noParse: [require.resolve('typescript/lib/typescript.js')],
        },
    },
    packages: {
        // the keys are the commonjs names that is applied to externals
        // this is the same as `@babel/plugin-transform-modules-commonjs` applies
        uiSchema: {
            name: '@ui-schema/ui-schema',
            root: path.resolve(__dirname, 'packages', 'ui-schema'),
            entry: path.resolve(__dirname, 'packages', 'ui-schema/src/'),
        },
        uiSchemaPro: {
            name: '@ui-schema/pro',
            root: path.resolve(__dirname, 'packages', 'ui-schema-pro'),
            entry: path.resolve(__dirname, 'packages', 'ui-schema-pro/src/'),
        },
        uiSchemaDictionary: {
            name: '@ui-schema/dictionary',
            root: path.resolve(__dirname, 'packages', 'dictionary'),
            entry: path.resolve(__dirname, 'packages', 'dictionary/src/'),
        },
        dsMaterial: {
            // noClean: true,
            name: '@ui-schema/ds-material',
            root: path.resolve(__dirname, 'packages', 'ds-material'),
            entry: path.resolve(__dirname, 'packages', 'ds-material/src/'),
        },
        dsBootstrap: {
            name: '@ui-schema/ds-bootstrap',
            root: path.resolve(__dirname, 'packages', 'ds-bootstrap'),
            entry: path.resolve(__dirname, 'packages', 'ds-bootstrap/src/'),
        },
        kitDnd: {
            name: '@ui-schema/kit-dnd',
            root: path.resolve(__dirname, 'packages', 'kit-dnd'),
            entry: path.resolve(__dirname, 'packages', 'kit-dnd/src/'),
        },
        materialPickers: {
            name: '@ui-schema/material-pickers',
            root: path.resolve(__dirname, 'packages', 'material-pickers'),
            entry: path.resolve(__dirname, 'packages', 'material-pickers/src/'),
        },
        materialSlate: {
            name: '@ui-schema/material-slate',
            root: path.resolve(__dirname, 'packages', 'material-slate'),
            entry: path.resolve(__dirname, 'packages', 'material-slate/src/'),
        },
        materialEditable: {
            name: '@ui-schema/material-editable',
            root: path.resolve(__dirname, 'packages', 'material-editable'),
            entry: path.resolve(__dirname, 'packages', 'material-editable/src/'),
        },
        materialCode: {
            name: '@ui-schema/material-code',
            root: path.resolve(__dirname, 'packages', 'material-code'),
            entry: path.resolve(__dirname, 'packages', 'material-code/src/'),
        },
        materialColor: {
            name: '@ui-schema/material-color',
            root: path.resolve(__dirname, 'packages', 'material-color'),
            entry: path.resolve(__dirname, 'packages', 'material-color/src/'),
        },
        materialEditorJs: {
            name: '@ui-schema/material-editorjs',
            root: path.resolve(__dirname, 'packages', 'material-editorjs'),
            entry: path.resolve(__dirname, 'packages', 'material-editorjs/src/'),
        },
        materialDnd: {
            name: '@ui-schema/material-dnd',
            root: path.resolve(__dirname, 'packages', 'material-dnd'),
            entry: path.resolve(__dirname, 'packages', 'material-dnd/src/'),
        },
    },
}, __dirname)
    .then(([execs, elapsed]) => {
        if(execs.indexOf('doServe') !== -1) {
            console.log('[packer] is now serving (after ' + elapsed + 'ms)')
        } else {
            console.log('[packer] finished successfully (after ' + elapsed + 'ms)', execs)
            process.exit(0)
        }
    })
    .catch((e) => {
        console.error('[packer] finished with error(s)', e)
        process.exit(1)
    })


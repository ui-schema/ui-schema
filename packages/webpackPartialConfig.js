
const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '@ui-schema/ui-schema': path.resolve(__dirname, './ui-schema/src'),
'@ui-schema/pro': path.resolve(__dirname, './ui-schema-pro/src'),
'@ui-schema/dictionary': path.resolve(__dirname, './dictionary/src'),
'@ui-schema/ds-material': path.resolve(__dirname, './ds-material/src'),
'@ui-schema/ds-bootstrap': path.resolve(__dirname, './ds-bootstrap/src'),
'@ui-schema/kit-dnd': path.resolve(__dirname, './kit-dnd/src'),
'@ui-schema/material-pickers': path.resolve(__dirname, './material-pickers/src'),
'@ui-schema/material-slate': path.resolve(__dirname, './material-slate/src'),
'@ui-schema/material-editorjs': path.resolve(__dirname, './material-editorjs/src'),
'@ui-schema/material-dnd': path.resolve(__dirname, './material-dnd/src'),

        }
    }
}
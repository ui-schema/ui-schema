
const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '@ui-schema/system': path.resolve(__dirname, './uis-system/src'),
'@ui-schema/react': path.resolve(__dirname, './uis-react/src'),
'@ui-schema/react-json-schema': path.resolve(__dirname, './uis-react-json-schema/src'),
'@ui-schema/json-schema': path.resolve(__dirname, './uis-json-schema/src'),
'@ui-schema/json-pointer': path.resolve(__dirname, './uis-json-pointer/src'),
'@ui-schema/dictionary': path.resolve(__dirname, './dictionary/src'),
'@ui-schema/ds-material': path.resolve(__dirname, './ds-material/src'),

        }
    }
}
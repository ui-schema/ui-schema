import React from 'react';
import {Button, Box, Typography, useTheme} from "@material-ui/core";
import {createMap, createOrderedMap, SchemaEditorProvider, SchemaRootRenderer, isInvalid, createEmptyStore, useSchemaStore} from "@ui-schema/ui-schema";
import {widgets} from "@ui-schema/ds-material";
import {RichCodeEditor,} from "../RichCodeEditor";
import {browserT} from "../../t";
import Loadable from "react-loadable";
import {LoadingPageModule} from "../Layout/Layout";
import style from "codemirror/lib/codemirror.css";
import themeDark from 'codemirror/theme/duotone-dark.css';
import themeLight from 'codemirror/theme/duotone-light.css';
import {WidgetCodeProvider} from "@ui-schema/material-code";

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    Code: Loadable({
        loader: () => import('@ui-schema/material-code').then(r => r.Code),
        loading: () => <LoadingPageModule title={'Loading Code Widget'}/>,
    }),
    DateTime: Loadable({
        loader: () => import('@ui-schema/material-pickers').then(r => r.DateTimePicker),
        loading: () => <LoadingPageModule title={'Loading DateTime Widget'}/>,
    }),
    Date: Loadable({
        loader: () => import('@ui-schema/material-pickers').then(r => r.DatePicker),
        loading: () => <LoadingPageModule title={'Loading Date Widget'}/>,
    }),
    Time: Loadable({
        loader: () => import('@ui-schema/material-pickers').then(r => r.TimePicker),
        loading: () => <LoadingPageModule title={'Loading Time Widget'}/>,
    }),
    RichText: Loadable({
        loader: () => import('@ui-schema/material-richtext/es/RichText').then(r => r.RichText),
        loading: () => <LoadingPageModule title={'Loading RichText Widget'}/>,
    }),
    RichTextInline: Loadable({
        loader: () => import('@ui-schema/material-richtext/es/RichTextInline').then(r => r.RichTextInline),
        loading: () => <LoadingPageModule title={'Loading RichText Widget'}/>,
    })
};

const SchemaJSONEditor = ({schema, setJsonError, setSchema, tabSize, fontSize, richIde, renderChange, theme, maxLines, enableShowAll}) => {
    return <RichCodeEditor
        tabSize={tabSize}
        fontSize={fontSize}
        raw={!richIde}
        theme={theme}
        enableShowAll={enableShowAll}
        renderChange={renderChange}
        value={typeof schema === 'string' ? schema : JSON.stringify(schema.toJS(), null, tabSize)}
        onChange={(newValue) => {
            try {
                setJsonError(false);
                setSchema(createOrderedMap(JSON.parse(newValue)));
            } catch(e) {
                setJsonError(e.toString());
                setSchema(newValue);
            }
        }}
        minLines={3} maxLines={maxLines}
    />
};

const SchemaDataDebug = ({tabSize, fontSize, richIde, renderChange, theme, maxLines}) => {
    const {valueStore} = useSchemaStore();

    return <RichCodeEditor
        value={typeof valueStore !== 'string' && typeof valueStore !== 'number' && typeof valueStore !== 'boolean' && valueStore ? JSON.stringify(valueStore.toJS(), null, tabSize) : valueStore}
        theme={theme}
        tabSize={tabSize}
        fontSize={fontSize}
        renderChange={renderChange}
        raw={!richIde}
        minLines={3} maxLines={maxLines}
        readOnly
    />
};

const useStyle = (styles) => {
    React.useEffect(() => {
        styles.use();
        return () => styles.unuse();
    }, [styles]);
};

const DemoEditor = ({activeSchema, id = 0, onClick, showDebugger = true, split = true, uiStyle}) => {
    const [jsonError, setJsonError] = React.useState(false);
    const [maxLines, /*setMaxLines*/] = React.useState(15);
    const {palette} = useTheme();

    useStyle(style);
    useStyle(palette.type === 'dark' ? themeDark : themeLight);

    // default schema state - begin
    const [showValidity, /*setShowValidity*/] = React.useState(true);
    const [validity, setValidity] = React.useState(createMap());
    const [schema, setSchema] = React.useState(createOrderedMap(activeSchema));
    const [data, setData] = React.useState(() => createEmptyStore(schema.get('type')));
    // end - default schema state

    React.useEffect(() => {
        let schema = createOrderedMap(activeSchema);
        setSchema(schema);
        setData(createEmptyStore(schema.get('type')));
    }, [activeSchema]);

    const tabSize = 2;
    const fontSize = 13;

    return <WidgetCodeProvider theme={palette.type === 'dark' ? 'duotone-dark' : 'duotone-light'}>
        <SchemaEditorProvider
            schema={schema}
            store={data}
            onChange={setData}
            widgets={customWidgets}
            validity={validity}
            showValidity={showValidity}
            onValidity={setValidity}
            t={browserT}
        >
            {showDebugger && !split ? <DebugSchemaEditor
                schema={schema} setSchema={setSchema}
                setJsonError={setJsonError} richIde
                enableShowAll={!split} split={split}
                id={id} tabSize={tabSize} fontSize={fontSize} maxLines={maxLines}
            /> : null}

            {jsonError ?
                <Box style={{margin: '0 12px 0 12px'}}>
                    <Typography component={'h2'} variant={'h6'} color={'error'}>
                        JSON-Error:
                    </Typography>

                    <Typography component={'p'} variant={'subtitle1'}>
                        {jsonError.replace('SyntaxError: JSON.parse: ', '')}
                    </Typography>
                </Box> :
                typeof schema === 'string' ? null : <div style={uiStyle}>

                    {/* ! this is the actual editor component ! */}
                    <SchemaRootRenderer/>

                    {onClick ? <Button
                        variant={'contained'}
                        disabled={!!isInvalid(validity)}
                        style={{marginTop: 12}}
                        onClick={() => isInvalid(validity) ? undefined : onClick(data)}>Send</Button> : null}
                </div>}

            {showDebugger ? <Box style={{display: 'flex', flexWrap: 'wrap', margin: '12px 0 24px 0'}}>
                {split ? <DebugSchemaEditor
                    schema={schema} setSchema={setSchema}
                    setJsonError={setJsonError} richIde
                    enableShowAll={!split} split={split}
                    id={id} tabSize={tabSize} fontSize={fontSize} maxLines={maxLines}
                /> : null}

                <Box style={{width: split ? '50%' : '100%', paddingLeft: split ? 6 : 0}}>
                    <Typography component={'p'} variant={'overline'} style={{paddingLeft: 4}}>
                        Data:
                    </Typography>
                    <SchemaDataDebug
                        richIde
                        id={id} tabSize={tabSize} fontSize={fontSize} maxLines={maxLines}
                    />
                </Box>
            </Box> : null}
        </SchemaEditorProvider>
    </WidgetCodeProvider>;
};

const DebugSchemaEditor = ({split, ...props}) => <Box style={{width: split ? '50%' : '100%', paddingRight: split ? 6 : 0}}>
    <Typography component={'p'} variant={'overline'} style={{paddingLeft: 4}}>
        Schema:
    </Typography>
    <SchemaJSONEditor
        richIde
        {...props}
    />
</Box>;

export default DemoEditor;

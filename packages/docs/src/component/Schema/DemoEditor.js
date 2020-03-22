import React from 'react';
import {Button, Box, Typography, useTheme} from "@material-ui/core";
import {createOrderedMap, SchemaEditorProvider, SchemaRootRenderer, isInvalid, createEmptyStore, useSchemaStore} from "@ui-schema/ui-schema";
import {widgets} from "@ui-schema/ds-material";
import {RichCodeEditor,} from "../RichCodeEditor";
import {browserT} from "../../t";
import Loadable from "react-loadable";
import style from "codemirror/lib/codemirror.css";
import themeDark from 'codemirror/theme/duotone-dark.css';
import themeLight from 'codemirror/theme/duotone-light.css';
import {WidgetCodeProvider} from "@ui-schema/material-code";
import {
    Color, ColorDialog,
    ColorSwatches,
    ColorCircle, ColorCompact, ColorMaterial,
    ColorBlock, ColorTwitter, ColorSlider,
    ColorAlpha, ColorHue, ColorSketch,
    ColorSliderStatic, ColorStatic,
    ColorCircleStatic, ColorTwitterStatic,
    ColorSketchStatic, ColorSketchDialog,
} from "@ui-schema/material-color";
import {LoadingCircular} from "@control-ui/core/es/LoadingCircular";

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    Color,
    ColorDialog,
    ColorStatic,
    ColorSwatches,
    ColorCircle,
    ColorCompact,
    ColorMaterial,
    ColorTwitter,
    ColorBlock,
    ColorSlider,
    ColorAlpha,
    ColorHue,
    ColorSketch,
    ColorSliderStatic,
    ColorCircleStatic,
    ColorTwitterStatic,
    ColorSketchStatic,
    ColorSketchDialog,
    Code: Loadable({
        loader: () => import('@ui-schema/material-code').then(r => r.Code),
        loading: () => <LoadingCircular title={'Loading Code Widget'}/>,
    }),
    DateTime: Loadable({
        loader: () => import('@ui-schema/material-pickers').then(r => r.DateTimePicker),
        loading: () => <LoadingCircular title={'Loading DateTime Widget'}/>,
    }),
    Date: Loadable({
        loader: () => import('@ui-schema/material-pickers').then(r => r.DatePicker),
        loading: () => <LoadingCircular title={'Loading Date Widget'}/>,
    }),
    Time: Loadable({
        loader: () => import('@ui-schema/material-pickers').then(r => r.TimePicker),
        loading: () => <LoadingCircular title={'Loading Time Widget'}/>,
    }),
    RichText: Loadable({
        loader: () => import('@ui-schema/material-richtext/es/RichText').then(r => r.RichText),
        loading: () => <LoadingCircular title={'Loading RichText Widget'}/>,
    }),
    RichTextInline: Loadable({
        loader: () => import('@ui-schema/material-richtext/es/RichTextInline').then(r => r.RichTextInline),
        loading: () => <LoadingCircular title={'Loading RichText Widget'}/>,
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
    const [schema, setSchema] = React.useState(createOrderedMap(activeSchema));
    const [store, setStore] = React.useState(() => createEmptyStore(schema.get('type')));
    // end - default schema state

    React.useEffect(() => {
        let schema = createOrderedMap(activeSchema);
        setSchema(schema);
        setStore(createEmptyStore(schema.get('type')));
    }, [activeSchema]);

    const tabSize = 2;
    const fontSize = 13;

    return <WidgetCodeProvider theme={palette.type === 'dark' ? 'duotone-dark' : 'duotone-light'}>
        <SchemaEditorProvider
            schema={schema}
            store={store}
            onChange={setStore}
            widgets={customWidgets}
            showValidity={showValidity}
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
                        disabled={!!isInvalid(store.getValidity())}
                        style={{marginTop: 12}}
                        onClick={() => isInvalid(store.getValidity()) ? undefined : onClick(store)}>Send</Button> : null}
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

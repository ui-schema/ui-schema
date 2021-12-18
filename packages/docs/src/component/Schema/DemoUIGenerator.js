import React from 'react';
import {Button, Box, Typography, useTheme} from '@material-ui/core';
import {createOrderedMap, UIRootRenderer, isInvalid, createEmptyStore, storeUpdater, UIStoreProvider} from '@ui-schema/ui-schema';
import {RichCodeEditor} from '../RichCodeEditor';
import style from 'codemirror/lib/codemirror.css';
import themeDark from 'codemirror/theme/duotone-dark.css';
import themeLight from 'codemirror/theme/duotone-light.css';
import {WidgetCodeProvider} from '@ui-schema/material-code';
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import LuxonAdapter from '@date-io/luxon';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {DragDropProvider as DragDropProviderSimple} from '@ui-schema/material-rbd/DragDropProvider/DragDropProvider';
import {makeDragDropContext as makeDragDropContextSimple} from '@ui-schema/material-rbd/DragDropProvider/makeDragDropContext';
import {makeDragDropContext} from '@ui-schema/material-dnd/DragDropProvider/makeDragDropContext';
import {DragDropProvider} from '@ui-schema/material-dnd/DragDropProvider/DragDropProvider';
import {OrderedMap} from 'immutable';

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

const SchemaDataDebug = ({tabSize, fontSize, richIde, renderChange, theme, maxLines, store}) => {
    return <RichCodeEditor
        value={typeof store.getValues() !== 'string' && typeof store.getValues() !== 'number' && typeof store.getValues() !== 'boolean' && store.getValues() ? JSON.stringify(store.valuesToJS(), null, tabSize) : store.getValues()}
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

const modes = {
    json: {
        name: 'javascript',
        json: true,
    },
}

const DemoUIGenerator = ({activeSchema, id = 0, onClick, showDebugger = true, split = true, uiStyle}) => {
    const [jsonError, setJsonError] = React.useState(false);
    const [maxLines /*setMaxLines*/] = React.useState(15);
    const {palette} = useTheme();

    useStyle(style);
    useStyle(palette.type === 'dark' ? themeDark : themeLight);

    // default schema state - begin
    const [showValidity /*setShowValidity*/] = React.useState(true);
    const [schema, setSchema] = React.useState(createOrderedMap(activeSchema));
    const [store, setStore] = React.useState(() => createEmptyStore(schema.get('type')));
    // end - default schema state

    React.useEffect(() => {
        let schema = createOrderedMap(activeSchema);
        setSchema(() => schema);
        setStore(oldStore => {
            const newStore = createEmptyStore(schema.get('type'))
            if(newStore.values.equals && newStore.values.equals(oldStore.values)) {
                // only change the store, when the values have really changed - otherwise it could overwrite the already changed validity
                return oldStore
            }
            return newStore
        });
    }, [activeSchema, setSchema, setStore]);

    const onChange = React.useCallback((storeKeys, scopes, updater, deleteOnEmpty, type) => {
        setStore(prevStore => {
            return storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type)(prevStore)
        })
    }, [setStore]);

    const dragStoreContext = makeDragDropContext(onChange, OrderedMap.isMap(schema) ? schema.get('$defs') || schema.get('definitions') : OrderedMap())
    const dragStoreContextSimple = makeDragDropContextSimple(onChange, OrderedMap.isMap(schema) ? schema.get('$defs') || schema.get('definitions') : OrderedMap())

    const tabSize = 2;
    const fontSize = 13;

    return <div style={uiStyle}>
        <WidgetCodeProvider
            theme={palette.type === 'dark' ? 'duotone-dark' : 'duotone-light'}
            modes={modes}
        >
            <MuiPickersUtilsProvider utils={LuxonAdapter}>
                <DragDropProvider contextValue={dragStoreContext.contextValue}>
                    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                        <DragDropProviderSimple contextValue={dragStoreContextSimple.contextValue}>
                            <UIStoreProvider
                                store={store}
                                onChange={onChange}
                                showValidity={showValidity}
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
                                    </Box> : null}

                                {typeof schema === 'string' ? null : <UIRootRenderer schema={schema}/>}
                            </UIStoreProvider>
                        </DragDropProviderSimple>
                    </DndProvider>
                </DragDropProvider>
            </MuiPickersUtilsProvider>
        </WidgetCodeProvider>

        {typeof schema === 'string' ? null :
            onClick ? <Button
                variant={'contained'}
                disabled={!!isInvalid(store.getValidity())}
                style={{marginTop: 12}}
                onClick={() => isInvalid(store.getValidity()) ? undefined : onClick(store)}>Send</Button> : null}

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
                    richIde store={store}
                    id={id} tabSize={tabSize} fontSize={fontSize} maxLines={maxLines}
                />
            </Box>
        </Box> : null}
    </div>;
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

export default DemoUIGenerator;

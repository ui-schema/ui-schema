import React from 'react';
import AppTheme from './layout/AppTheme';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import {ImmutableEditor, themeMaterial} from 'react-immutable-editor';
import Dashboard from './dashboard/Dashboard';
import {widgets} from '@ui-schema/ds-material';
import {browserT} from '../t';
import {MuiSchemaDebug} from './component/MuiSchemaDebug';
import IcSave from '@material-ui/icons/Save'
import IcClear from '@material-ui/icons/Clear'
import IcHistory from '@material-ui/icons/History'
import IcRedo from '@material-ui/icons/Redo'
import IcUndo from '@material-ui/icons/Undo'
import useTheme from '@material-ui/core/styles/useTheme';
import {isInvalid} from '@ui-schema/ui-schema/ValidityReporter/isInvalid';
import {toHistory, useStorePro} from '@ui-schema/pro/UIStorePro';
import {schemaDragDropEditableSingle, schemaEditable} from '../schemas/demoDragDropEditable';
//import {TouchBackend} from 'react-dnd-touch-backend'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {DndProvider} from 'react-dnd'
import {DroppableRootMultiple} from '@ui-schema/material-dnd/Widgets/DroppableRootMultiple';
import {makeDragDropContext} from '@ui-schema/material-dnd/DragDropProvider/makeDragDropContext';
import {DragDropProvider} from '@ui-schema/material-dnd/DragDropProvider/DragDropProvider';
import {BlockPanel} from '@ui-schema/material-dnd/DraggableBlock/BlockPanel';
import {createStore, storeUpdater, UIApiProvider, UIMetaProvider, UIRootRenderer, UIStoreProvider} from '@ui-schema/ui-schema';
import {OrderedMap} from 'immutable';
import {DroppableRootSingle} from '@ui-schema/material-dnd/Widgets/DroppableRootSingle';
import {DroppableRootContent} from '@ui-schema/material-dnd/DroppableRoot/DroppableRootContent';
import {DroppablePanel} from '@ui-schema/material-dnd/Widgets/DroppablePanel';
import {EditableContent} from '@ui-schema/material-editable/Widgets';
import {RichContent, RichContentInline} from '@ui-schema/material-slate';

const customWidgets = {...widgets};
customWidgets.DraggableBlock = BlockPanel
customWidgets.DroppableRootContent = DroppableRootContent
customWidgets.custom = {
    ...widgets.custom,
    DroppableRootMultiple: DroppableRootMultiple,
    DroppableRootSingle: DroppableRootSingle,
    DroppablePanel: DroppablePanel,
    EditableContent: EditableContent,
    RichContent: RichContent,
    RichContentInline: RichContentInline,
};

const touchBackendOpts = {
    //enableMouseEvents: true,
}

const loadSchema = (url, versions) => {
    console.log('Demo loadSchema (url, optional versions)', url, versions)
    return fetch(url).then(r => r.json())
}

const initialStore = undefined

const schema = schemaDragDropEditableSingle

const EditorEditablePro = () => {
    const theme = useTheme();

    const [showHistory, setShowHistory] = React.useState(false);
    const [showValidity, setShowValidity] = React.useState(false);

    const prevOriginalStore = React.useRef(initialStore?.getValues())
    const {
        reset: resetHistoryStore,
        onChange, store, setStore,
        redoHistory, undoHistory,
    } = useStorePro({type: String(schema.get('type')), initialStore: initialStore})

    const dragStoreContext = makeDragDropContext(onChange, schema.get('$defs') || schema.get('definitions'))

    const type = String(schema.get('type'))
    const reset = React.useCallback(() => {
        resetHistoryStore(type, initialStore)
        prevOriginalStore.current = initialStore?.getValues()
    }, [type, resetHistoryStore, prevOriginalStore])

    const changedStore = (
        (!prevOriginalStore.current && store.current?.getValues().size > 0) ||
        (prevOriginalStore.current && !prevOriginalStore.current?.equals(store.current?.getValues()))
    )

    return <React.Fragment>
        <div>
            <Button
                startIcon={<IcUndo/>}
                disabled={store.activeIndex === 0}
                onClick={() => undoHistory(1)}
            >undo</Button>
            <Button
                startIcon={<IcRedo/>}
                disabled={store.activeIndex + 1 === store.list.size}
                onClick={() => redoHistory(1)}
            >redo</Button>
            <Button
                startIcon={<IcHistory/>}
                disabled={store.list.size === 1}
                onClick={() => setShowHistory(s => !s)}
            >history</Button>
            <Button
                startIcon={<IcClear/>}
                disabled={store.list.size === 1}
                onClick={reset}
            >clear</Button>
            <Button
                startIcon={<IcSave/>}
                disabled={!changedStore}
            >save</Button>
        </div>

        <UIApiProvider loadSchema={loadSchema} noCache>
            <DragDropProvider contextValue={dragStoreContext.contextValue}>
                <DndProvider backend={HTML5Backend} options={touchBackendOpts}>
                    <UIStoreProvider
                        store={store.current}
                        onChange={onChange}
                        showValidity={showValidity}
                    >
                        <UIRootRenderer schema={schema}/>
                        <MuiSchemaDebug schema={schema}/>
                    </UIStoreProvider>
                </DndProvider>
            </DragDropProvider>
        </UIApiProvider>

        <div style={{width: '100%'}}>
            <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
            <div>
                {isInvalid(store.current.getValidity()) ? 'invalid' : 'valid'}
            </div>
        </div>

        <Dialog
            onClose={() => setShowHistory(false)}
            open={showHistory}
        >
            <DialogTitle style={{textAlign: 'center'}}>Store History</DialogTitle>
            <DialogContent
                style={{minWidth: 350}}
            >
                {store.list.map((s, i) => <div key={i} style={{marginBottom: 18}}>
                    <Button
                        style={{fontWeight: 'bold'}}
                        onClick={() => {
                            setStore(store => toHistory(store, i))
                            setShowHistory(false)
                        }}
                    >Index: {i} {store.activeIndex === i ? 'is-active' : null}</Button>
                    <ImmutableEditor
                        data={s.getValues()}
                        onChange={() => console.log('not implemented')}
                        getVal={keys => s.getValues().getIn(keys)}
                        theme={{
                            ...themeMaterial,
                            type: theme.palette.type,
                            base00: theme.palette.background.paper,
                            base0D: theme.palette.text.secondary,
                            base0B: theme.palette.text.primary,
                        }}
                    />
                </div>)}
            </DialogContent>
        </Dialog>
    </React.Fragment>
};

const EditorEditable = () => {
    const [showValidity, setShowValidity] = React.useState(false);

    const [store, setStore] = React.useState(() => createStore(OrderedMap()));

    const onChange = React.useCallback((storeKeys, scopes, updater) => {
        setStore(prevStore => {
            return storeUpdater(storeKeys, scopes, updater)(prevStore)
        })
    }, [setStore])

    return <div style={{marginTop: 24, width: '100%'}}>
        <UIStoreProvider
            store={store}
            onChange={onChange}
            showValidity={showValidity}
        >
            <UIRootRenderer schema={schemaEditable}/>
            <MuiSchemaDebug schema={schemaEditable}/>
        </UIStoreProvider>

        <div style={{width: '100%'}}>
            <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
            <div>
                {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
            </div>
        </div>
    </div>
};

const Main = () => {
    return <React.Fragment>
        <EditorEditable/>
        <EditorEditablePro/>
    </React.Fragment>
};

export default () => <AppTheme>
    <UIMetaProvider widgets={customWidgets} t={browserT}>
        <Dashboard main={Main}/>
    </UIMetaProvider>
</AppTheme>

export {customWidgets}

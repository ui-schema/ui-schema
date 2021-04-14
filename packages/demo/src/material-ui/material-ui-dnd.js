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
import {UIGenerator} from '@ui-schema/ui-schema/UIGenerator';
import {toHistory, useStorePro} from '@ui-schema/pro/UIStorePro';
import {schemaDragDrop, schemaDragDropSingle} from '../schemas/demoDragDrop';
//import {TouchBackend} from 'react-dnd-touch-backend'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {DndProvider} from 'react-dnd'
import {makeDragDropContext} from '@ui-schema/material-dnd/DragDropProvider/makeDragDropContext';
import {DragDropProvider} from '@ui-schema/material-dnd/DragDropProvider/DragDropProvider';
import {BlockPanel} from '@ui-schema/material-dnd/DraggableBlock/BlockPanel';
import {createOrderedMap, createStore, storeUpdater, UIApiProvider} from '@ui-schema/ui-schema';
import {List} from 'immutable';
import {DroppableRootMultiple} from '@ui-schema/material-dnd/Widgets/DroppableRootMultiple';
import {DroppableRootSingle} from '@ui-schema/material-dnd/Widgets/DroppableRootSingle';
import {DroppableRootContent} from '@ui-schema/material-dnd/DroppableRoot/DroppableRootContent';
import {DroppablePanel} from '@ui-schema/material-dnd/Widgets/DroppablePanel';
import {RichContent, RichContentInline, RichContentPane} from '@ui-schema/material-slate';

const customWidgets = {...widgets};
customWidgets.DraggableBlock = BlockPanel
customWidgets.DroppableRootContent = DroppableRootContent
customWidgets.custom = {
    ...widgets.custom,
    DroppableRootMultiple: DroppableRootMultiple,
    DroppableRootSingle: DroppableRootSingle,
    DroppablePanel: DroppablePanel,
    RichContentPane: RichContentPane,
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

const initialStore = createStore(createOrderedMap({
    main: [
        {
            '$bid': '_bjugvdhrqn9',
            '$block': 'rich_content',
            'content': [
                {
                    'type': 'h1',
                    'children': [
                        {
                            'text': 'Hi!',
                        },
                    ],
                },
                {
                    'type': 'p',
                    'children': [
                        {
                            'text': 'Lorem Ipsum dolor sit amet.',
                        },
                    ],
                },
            ],
        },
        {
            '$bid': '_nt5y5qws6p',
            '$block': 'text',
            'text': 'Adepisci ut sut mot.',
        },
        {
            '$bid': '_q6s1lbxhs78',
            '$block': 'teasers',
            'list': [
                {
                    'headline': '1234',
                    'content': ' sgdffdg fdg sdf',
                },
                {
                    'headline': '56789',
                    'content': 'fgsd vnjghj hg',
                },
            ],
        },
    ],
}))

const schema = schemaDragDrop

const MultiEditor = () => {
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
                    <UIGenerator
                        schema={schema}
                        store={store.current}
                        onChange={onChange}
                        widgets={customWidgets}
                        showValidity={showValidity}
                        t={browserT}
                    >
                        <MuiSchemaDebug/>
                    </UIGenerator>
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

const schemaSingle = schemaDragDropSingle

const SingleEditor = () => {
    const [showValidity, setShowValidity] = React.useState(false);

    const [store, setStore] = React.useState(() => createStore(List()));

    const onChange = React.useCallback((storeKeys, scopes, updater, deleteOnEmpty, type) => {
        setStore(prevStore => {
            return storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type)(prevStore)
        })
    }, [setStore])

    const dragStoreContext = makeDragDropContext(onChange, schema.get('$defs') || schema.get('definitions'))

    return <React.Fragment>
        <DragDropProvider contextValue={dragStoreContext.contextValue}>
            <DndProvider backend={HTML5Backend} options={touchBackendOpts}>
                <UIGenerator
                    schema={schemaSingle}
                    store={store}
                    onChange={onChange}
                    widgets={customWidgets}
                    showValidity={showValidity}
                    t={browserT}
                >
                    <MuiSchemaDebug/>
                </UIGenerator>
            </DndProvider>
        </DragDropProvider>

        <div style={{width: '100%'}}>
            <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
            <div>
                {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
            </div>
        </div>
    </React.Fragment>
};

const Main = () => {
    return <React.Fragment>
        <MultiEditor/>
        <SingleEditor/>
    </React.Fragment>
};

export default () => <AppTheme>
    <Dashboard main={Main}/>
</AppTheme>

export {customWidgets}

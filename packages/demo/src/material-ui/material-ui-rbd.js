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
import {fromJSOrdered} from '@ui-schema/ui-schema/Utils/createMap';
import {createStore, storeUpdater, UIStoreProvider} from '@ui-schema/ui-schema/UIStore';
import {toHistory, useStorePro} from '@ui-schema/pro/UIStorePro';
import {schemaDragDrop, schemaDragDropSingle} from '../schemas/demoDragDropSimple';
import {DroppableRootMultiple} from '@ui-schema/material-rbd/Widgets/DroppableRootMultiple';
import {DragDropProvider} from '@ui-schema/material-rbd/DragDropProvider/DragDropProvider';
import {makeDragDropContext} from '@ui-schema/material-rbd/DragDropProvider/makeDragDropContext';
import {List} from 'immutable';
import {DroppableRootSingle} from '@ui-schema/material-rbd/Widgets/DroppableRootSingle';
import {UIMetaProvider} from '@ui-schema/ui-schema';
import {UIRootRenderer} from '@ui-schema/ui-schema/UIRootRenderer/UIRootRenderer';

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    SimpleDroppableRootMultiple: DroppableRootMultiple,
    SimpleDroppableRootSingle: DroppableRootSingle,
};

const initialStore = createStore(fromJSOrdered({person: {name: 'Kim Smith'}}))

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
        // todo: multi type support #68
    } = useStorePro({type: String(schema.get('type')), initialStore: initialStore})

    const dragStoreContext = makeDragDropContext(onChange, schema.get('$defs') || schema.get('definitions'))

    // todo: multi type support #68
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

        <DragDropProvider contextValue={dragStoreContext.contextValue}>
            <UIStoreProvider
                store={store.current}
                onChange={onChange}
                showValidity={showValidity}
            >
                <UIRootRenderer schema={schema}/>
                <MuiSchemaDebug schema={schema}/>
            </UIStoreProvider>
        </DragDropProvider>

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
    const [store, setStore] = React.useState(() => createStore(List()))
    const onChange = React.useCallback((storeKeys, scopes, updater) => {
        setStore(prevStore => {
            return storeUpdater(storeKeys, scopes, updater)(prevStore)
        })
    }, [setStore])

    const dragStoreContext = makeDragDropContext(onChange, schema.get('$defs') || schema.get('definitions'))

    return <React.Fragment>
        <DragDropProvider contextValue={dragStoreContext.contextValue}>
            <UIStoreProvider
                store={store}
                onChange={onChange}
                showValidity={showValidity}
            >
                <UIRootRenderer schema={schemaSingle}/>
                <MuiSchemaDebug schema={schemaSingle}/>
            </UIStoreProvider>
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
    <UIMetaProvider widgets={customWidgets} t={browserT}>
        <Dashboard main={Main}/>
    </UIMetaProvider>
</AppTheme>

export {customWidgets}

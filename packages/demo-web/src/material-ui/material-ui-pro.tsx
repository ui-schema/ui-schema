/* eslint-disable @typescript-eslint/no-deprecated */
import { MuiBinding } from '@ui-schema/ds-material/Binding'
import { bindingExtended } from '@ui-schema/ds-material/BindingExtended'
import { baseComponents, typeWidgets } from '@ui-schema/ds-material/BindingDefault'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { ImmutableEditor, themeMaterial, themeMaterialLight } from 'react-immutable-editor'
import { InfoRenderer } from '@ui-schema/ds-material/Component/InfoRenderer'
import { browserT } from '../t'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { schemaDemoReferencingRecursive } from '../schemas/demoReferencing'
import IcSave from '@mui/icons-material/Save'
import IcClear from '@mui/icons-material/Clear'
import IcHistory from '@mui/icons-material/History'
import IcRedo from '@mui/icons-material/Redo'
import IcUndo from '@mui/icons-material/Undo'
import { useTheme } from '@mui/material/styles'
import { isInvalid } from '@ui-schema/react/isInvalid'
import { fromJSOrdered } from '@ui-schema/ui-schema/createMap'
import { createStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { toHistory, useStorePro } from '@ui-schema/pro/UIStorePro'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import Grid from '@mui/material/Grid'
import { widgetPluginsLegacy } from './widgetPluginsLegacy'

const customWidgets: MuiBinding = {
    ...baseComponents,
    InfoRenderer: InfoRenderer,
    widgetPlugins: widgetPluginsLegacy,
    widgets: {
        ...typeWidgets,
        ...bindingExtended,
    },
}

// or set to `undefined` for no-initial values
//const initialStore = createStore(fromJSOrdered({person: {name: 'Kim Smith'}}))
const initialStore = createStore(fromJSOrdered({
    person: {
        'name': 'Kim Smith',
        'children': [
            {
                'name': '4335534',
            },
            {
                'name': 'gegfgtg',
                'children': [
                    {
                        'name': 'asdcvbn',
                        'children': [
                            {
                                'name': '233456',
                            },
                        ],
                    },
                    {
                        'name': 'fddgfdfdfgdfs',
                        'children': [
                            {
                                'name': '23456',
                            },
                        ],
                    },
                ],
            },
            {
                'name': 'dfgdgfdgf',
            },
        ],
    },
}))

const schema = schemaDemoReferencingRecursive
const Main = () => {
    const theme = useTheme()

    const [showHistory, setShowHistory] = React.useState(false)
    const [showValidity, setShowValidity] = React.useState(false)

    const prevOriginalStore = React.useRef(initialStore?.getValues())
    const {
        reset: resetHistoryStore,
        onChange, store, setStore,
        redoHistory, undoHistory,
        // todo: multi type support #68
    } = useStorePro({
        type: String(schema.get('type')),
        initialStore: initialStore,
        storeUpdater: storeUpdater,
    })

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

        <UIStoreProvider
            store={store.current}
            onChange={onChange}
            showValidity={showValidity}
        >
            <GridContainer>
                <WidgetEngine isRoot schema={schema}/>
            </GridContainer>
            <MuiSchemaDebug schema={schema}/>
        </UIStoreProvider>

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
                        getVal={keys => keys.length ? s.getValues().getIn(keys) : s.getValues()}
                        theme={{
                            ...theme.palette.mode === 'light' ? themeMaterialLight : themeMaterial,
                            base00: theme.palette.background.paper,
                        }}
                    />
                </div>)}
            </DialogContent>
        </Dialog>
    </React.Fragment>
}

// eslint-disable-next-line react/display-name
export default () => <>
    <UIMetaProvider binding={customWidgets} t={browserT}>
        <Grid container spacing={3}>
            <Grid item xs={12} sx={{p: 2}}>
                <Main/>
            </Grid>
        </Grid>
    </UIMetaProvider>
</>

export { customWidgets }

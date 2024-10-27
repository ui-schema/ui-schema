import React from 'react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { ImmutableEditor, themeMaterial, themeMaterialLight } from 'react-immutable-editor'
import { InfoRenderer, InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'
import { browserT } from '../t'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import IcSave from '@mui/icons-material/Save'
import IcClear from '@mui/icons-material/Clear'
import IcHistory from '@mui/icons-material/History'
import IcRedo from '@mui/icons-material/Redo'
import IcUndo from '@mui/icons-material/Undo'
import { useTheme } from '@mui/material/styles'
import { isInvalid } from '@ui-schema/react/ValidityReporter'
import { toHistory, useStorePro } from '@ui-schema/pro/UIStorePro'
import { EditorJSWidget } from '@ui-schema/material-editorjs/Widgets/EditorJSWidget'
import Paragraph from '@editorjs/paragraph'
import CheckList from '@editorjs/checklist'
import List from '@editorjs/list'
import Header from '@editorjs/header'
import Table from '@editorjs/table'
import { schemaDemoEditorJS } from '../schemas/demoEditorJS'
import * as WidgetsDefault from '@ui-schema/ds-material/WidgetsDefault'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { injectWidgetEngine } from '@ui-schema/react/applyWidgetEngine'
import { UIStoreProvider, UIStoreType } from '@ui-schema/react/UIStore'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'

const tools = {
    paragraph: Paragraph,
    checkList: CheckList,
    list: List,
    header: Header,
    table: Table,
}
const EditorJSRichContent = (props) => {
    return <EditorJSWidget
        {...props}
        tools={tools}
    />
}
const {widgetPlugins, schemaPlugins} = WidgetsDefault.plugins()
const customWidgets = WidgetsDefault.define<{ InfoRenderer?: React.ComponentType<InfoRendererProps> }, {}>({
    InfoRenderer: InfoRenderer,
    widgetPlugins: widgetPlugins,
    schemaPlugins: schemaPlugins,
    types: WidgetsDefault.widgetsTypes(),
    custom: {
        ...WidgetsDefault.widgetsCustom(),
        EditorJS: EditorJSRichContent,
    },
})

const initialStore: UIStoreType | undefined = undefined as undefined | UIStoreType
const GridStack = injectWidgetEngine(GridContainer)
const schema = schemaDemoEditorJS

const Main = () => {
    const theme = useTheme()

    const [showHistory, setShowHistory] = React.useState(false)
    const [showValidity, setShowValidity] = React.useState(false)

    const prevOriginalStore = React.useRef(initialStore?.getValues())
    const {
        reset: resetHistoryStore,
        onChange, store, setStore,
        redoHistory, undoHistory,
    } = useStorePro({type: String(schema.get('type')), initialStore: initialStore})

    console.log(store.toJS())

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
            <GridStack isRoot schema={schema}/>
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
                        getVal={keys => s.getValues().getIn(keys)}
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
    <UIMetaProvider widgets={customWidgets} t={browserT}>
        <Grid container spacing={3}>
            <Grid item xs={12} /*style={{margin: '0 16px', width: '100%'}}*/>
                <Main/>
            </Grid>
        </Grid>
    </UIMetaProvider>
</>

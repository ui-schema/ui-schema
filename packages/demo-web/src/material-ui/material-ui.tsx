import React from 'react'
import { useToggle } from '../component/useToggle'
import { dataDemoMain, schemaDemoMain, schemaUser } from '../schemas/demoMain'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import * as WidgetsDefault from '@ui-schema/ds-material/WidgetsDefault'
import { createOrderedMap, createMap } from '@ui-schema/system/createMap'
import { isInvalid } from '@ui-schema/react/ValidityReporter'
import { createStore, createEmptyStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { storeUpdater2 } from '@ui-schema/react/storeUpdater2'
import { injectWidgetEngine } from '@ui-schema/react/applyWidgetEngine'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { browserT } from '../t'
import { UIApiProvider } from '@ui-schema/react/UIApi'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets/TableAdvanced'
import { InfoRenderer, InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'
import { SelectChips } from '@ui-schema/ds-material/Widgets/SelectChips'

const {widgetPlugins, schemaPlugins} = WidgetsDefault.plugins()
const customWidgets = WidgetsDefault.define<{ InfoRenderer?: React.ComponentType<InfoRendererProps> }, {}>({
    InfoRenderer: InfoRenderer,
    widgetPlugins: widgetPlugins,
    schemaPlugins: schemaPlugins,
    types: WidgetsDefault.widgetsTypes(),
    custom: {
        ...WidgetsDefault.widgetsCustom(),
        SelectChips: SelectChips,
        TableAdvanced: TableAdvanced,
    },
})
//widgets.types.null = () => 'null'

const GridStack = injectWidgetEngine(GridContainer)

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false)
    const [store, setStore] = React.useState(() => createStore(createMap(dataDemoMain)))
    const [schema, setSchema] = React.useState(() => createOrderedMap(schemaDemoMain))

    const onChange = React.useCallback((actions) => {
        setStore(prevStore => {
            const newStore = storeUpdater2(actions)(prevStore)
            /*const newValue = newStore.getIn(prependKey(storeKeys, 'values'))
            const prevValue = prevStore.getIn(prependKey(storeKeys, 'values'))
            console.log(
                isImmutable(newValue) ? newValue.toJS() : newValue,
                isImmutable(prevValue) ? prevValue.toJS() : prevValue,
                storeKeys.toJS(),
                deleteOnEmpty, type,
            )*/
            return newStore
        })
    }, [setStore])

    return <React.Fragment>
        <UIStoreProvider
            store={store}
            onChange={onChange}
            showValidity={showValidity}
            //doNotDefault
        >
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    overflow: 'auto',
                    flexDirection: 'column',
                }}
            >
                <GridStack isRoot schema={schema}/>
                <MuiSchemaDebug setSchema={setSchema} schema={schema}/>

                <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
                {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}

            </Paper>

            <MuiSchemaDebug setSchema={setSchema} schema={schema}/>

        </UIStoreProvider>
    </React.Fragment>
}

const DemoUser: React.FC<{}> = () => {
    const [store, setStore] = React.useState(() => createEmptyStore())

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater2(actions))
    }, [setStore])

    return <Grid container spacing={3} sx={{justifyContent: 'center'}}>
        <Grid item xs={12} md={8}>
            <UIStoreProvider
                store={store}
                onChange={onChange}
                showValidity
            >
                <GridStack isRoot schema={schemaUser}/>
                <MuiSchemaDebug schema={schemaUser}/>
            </UIStoreProvider>
        </Grid>
    </Grid>
}

const loadSchema = (url, versions) => {
    console.log('Demo loadSchema (url, optional versions)', url, versions)
    return fetch(url).then(r => r.json())
}

const Main = () => {
    const [toggle, getToggle] = useToggle()

    return <Grid container spacing={3}>
        <Grid item xs={12}>
            <MainStore/>
        </Grid>
        <Grid item xs={12}>
            <Button style={{marginBottom: 12}} onClick={() => toggle('demoUser')} variant={getToggle('demoUser') ? 'contained' : 'outlined'}>
                demo User
            </Button>
            {getToggle('demoUser') ?
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        overflow: 'auto',
                        flexDirection: 'column',
                    }}
                >
                    <DemoUser/>
                </Paper> : null}
        </Grid>
    </Grid>
}

export default function MaterialDemo() {
    return <>
        <UIMetaProvider widgets={customWidgets} t={browserT}>
            <UIApiProvider loadSchema={loadSchema} noCache>
                <Main/>
            </UIApiProvider>
        </UIMetaProvider>
    </>
}

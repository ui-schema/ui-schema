import React from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import * as WidgetsDefault from '@ui-schema/ds-material/WidgetsDefault'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { createStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { injectWidgetEngine } from '@ui-schema/react/applyWidgetEngine'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { browserT } from '../t'
import { OrderedMap } from 'immutable'
import { NumberRendererDebounced, StringRendererDebounced, TextRendererDebounced } from '@ui-schema/ds-material/Widgets/TextFieldDebounced'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { InfoRenderer, InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'

const {widgetPlugins} = WidgetsDefault.plugins()
const customWidgets = WidgetsDefault.define<{ InfoRenderer?: React.ComponentType<InfoRendererProps> }, {}>({
    InfoRenderer: InfoRenderer,
    widgetPlugins: widgetPlugins,
    types: {
        ...WidgetsDefault.widgetsTypes(),
        string: StringRendererDebounced,
        number: NumberRendererDebounced,
        integer: NumberRendererDebounced,
    },
    custom: {
        ...WidgetsDefault.widgetsCustom(),
        Text: TextRendererDebounced,
    },
})

const formSchema = createOrderedMap({
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        value: {
            type: 'number',
        },
        message: {
            type: 'string',
            widget: 'Text',
        },
    },
}/* satisfies JsonSchema*/)

const GridStack = injectWidgetEngine(GridContainer)
const FormComp = () => {
    const showValidity = true
    const [store, setStore] = React.useState(() => createStore(OrderedMap()))

    const onChange = React.useCallback((actions: UIStoreActions[] | UIStoreActions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return <UIStoreProvider<{}, any, UIStoreActions>
        store={store}
        onChange={onChange}
        showValidity={showValidity}
    >
        <GridStack isRoot schema={formSchema}/>
        <MuiSchemaDebug schema={formSchema}/>
    </UIStoreProvider>
}

// eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
export default () => <>
    <UIMetaProvider widgets={customWidgets} t={browserT}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        overflow: 'auto',
                        flexDirection: 'column',
                    }}
                >
                    <FormComp/>
                </Paper>
            </Grid>
        </Grid>
    </UIMetaProvider>
</>

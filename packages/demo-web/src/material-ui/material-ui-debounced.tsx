/* eslint-disable @typescript-eslint/no-deprecated */
import { MuiBinding } from '@ui-schema/ds-material'
import { bindingExtended } from '@ui-schema/ds-material/BindingExtended'
import { baseComponents, typeWidgets } from '@ui-schema/ds-material/BindingDefault'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import React from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { createStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { browserT } from '../t'
import { OrderedMap } from 'immutable'
import { NumberRendererDebounced, StringRendererDebounced, TextRendererDebounced } from '@ui-schema/ds-material/Widgets/TextFieldDebounced'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { InfoRenderer } from '@ui-schema/ds-material/Component/InfoRenderer'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { widgetPluginsLegacy } from './widgetPluginsLegacy'

const customWidgets: MuiBinding = {
    ...baseComponents,
    InfoRenderer: InfoRenderer,
    widgetPlugins: widgetPluginsLegacy,
    widgets: {
        ...typeWidgets,
        string: StringRendererDebounced,
        number: NumberRendererDebounced,
        integer: NumberRendererDebounced,
        ...bindingExtended,
        Text: TextRendererDebounced,
    },
}

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
        <GridContainer>
            <WidgetEngine isRoot schema={formSchema}/>
        </GridContainer>
        <MuiSchemaDebug schema={formSchema}/>
    </UIStoreProvider>
}

// eslint-disable-next-line react/display-name
export default () => <>
    <UIMetaProvider binding={customWidgets} t={browserT}>
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

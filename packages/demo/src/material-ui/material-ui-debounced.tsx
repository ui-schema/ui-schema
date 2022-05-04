import React from 'react'
import AppTheme from './layout/AppTheme'
import Dashboard from './dashboard/Dashboard'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { widgets } from '@ui-schema/ds-material'
import { createOrderedMap, createStore, injectPluginStack, JsonSchema, UIMetaProvider, UIStoreActions, UIStoreProvider } from '@ui-schema/ui-schema'
import { browserT } from '../t'
import { storeUpdater } from '@ui-schema/ui-schema/storeUpdater'
import { OrderedMap } from 'immutable'
import { NumberRendererDebounced, StringRendererDebounced, TextRendererDebounced } from '@ui-schema/ds-material/Widgets/TextFieldDebounced/TextFieldDebounced'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'

const customWidgets = {...widgets}
const pluginStack = [...customWidgets.pluginStack]
// the referencing network handler should be at first position
// must be before the `ReferencingHandler`, thus if the root schema for the level is a network schema,
// the network handler can download it, and the normal referencing handler may handle references inside of e.g. `if`
// maybe the network handlers adds a generic prop `resolveNetworkRef`, to request network schema inside e.g. an `if` from inside the ReferencingHandler
// pluginStack.splice(0, 0, ReferencingNetworkHandler)
customWidgets.pluginStack = pluginStack

customWidgets.types.string = StringRendererDebounced
customWidgets.types.number = NumberRendererDebounced
customWidgets.types.integer = NumberRendererDebounced
customWidgets.custom.Text = TextRendererDebounced

//widgets.types.null = () => 'null'

const Main = ({classes}: { classes: { paper: string } }) => {
    return <React.Fragment>
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <FormComp/>
            </Paper>
        </Grid>
    </React.Fragment>
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
} as JsonSchema)

const GridStack = injectPluginStack(GridContainer)
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
export default () => <AppTheme>
    <div>
        <UIMetaProvider widgets={customWidgets} t={browserT}>
            <Dashboard main={Main}/>
        </UIMetaProvider>
    </div>
</AppTheme>

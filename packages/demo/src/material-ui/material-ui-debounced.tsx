import React from 'react'
import AppTheme from './layout/AppTheme'
import Dashboard from './dashboard/Dashboard'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { widgets } from '@ui-schema/ds-material'
import { createOrderedMap, createStore, UIMetaProvider, UIStoreActions, UIStoreProvider, UIStoreType } from '@ui-schema/ui-schema'
import { browserT } from '../t'
import { storeUpdater } from '@ui-schema/ui-schema/storeUpdater'
import { OrderedMap } from 'immutable'
import { NumberRendererDebounced, StringRendererDebounced, TextRendererDebounced } from '@ui-schema/ds-material/Widgets/TextFieldDebounced/TextFieldDebounced'
import { UIRootRenderer } from '@ui-schema/ui-schema/UIRootRenderer/UIRootRenderer'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'

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
})

const FormComp = () => {
    const showValidity = true
    const [store, setStore] = React.useState(() => createStore(OrderedMap()))

    const onChange = React.useCallback((actions: UIStoreActions[] | UIStoreActions) => {
        setStore(storeUpdater<UIStoreType>(actions))
    }, [setStore])

    return <React.Fragment>
        <UIStoreProvider<{}, any, UIStoreActions>
            store={store}
            onChange={onChange}
            showValidity={showValidity}
        >
            <UIRootRenderer schema={formSchema}/>
            <MuiSchemaDebug schema={formSchema}/>
        </UIStoreProvider>
    </React.Fragment>
}

// eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
export default () => <AppTheme>
    <div>
        <UIMetaProvider widgets={customWidgets} t={browserT}>
            <Dashboard main={Main}/>
        </UIMetaProvider>
    </div>
</AppTheme>

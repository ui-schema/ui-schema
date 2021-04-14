import React from 'react'
import AppTheme from './layout/AppTheme'
import Dashboard from './dashboard/Dashboard'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { Button } from '@material-ui/core'
import { Step, Stepper, widgets } from '@ui-schema/ds-material'
import { isInvalid, createOrderedMap, createStore, StoreKeys, StoreSchemaType, WidgetProps, loadSchemaUIApi } from '@ui-schema/ui-schema'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { browserT } from '../t'
import { useDummy } from '../component/MainDummy'
import { UIApiProvider } from '@ui-schema/ui-schema/UIApi/UIApi'
import { ReferencingNetworkHandler } from '@ui-schema/ui-schema/Plugins/ReferencingHandler'
import { storeUpdater } from '@ui-schema/ui-schema/UIStore/storeUpdater'
import { Table } from '@ui-schema/ds-material/Widgets/Table'
import { NumberRendererCell, StringRendererCell, TextRendererCell } from '@ui-schema/ds-material/Widgets/TextFieldCell'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets/TableAdvanced/TableAdvanced'
import { List, OrderedMap } from 'immutable'
import { UIProvider } from '@ui-schema/ui-schema/UIGenerator/UIGenerator'
import { PluginStack } from '@ui-schema/ui-schema/PluginStack/PluginStack'
import { applyPluginStack } from '@ui-schema/ui-schema/applyPluginStack'
import { StringRenderer } from '@ui-schema/ds-material/Widgets/TextField'

const customWidgets = {...widgets}
const pluginStack = [...customWidgets.pluginStack]
// the referencing network handler should be at first position
// must be before the `ReferencingHandler`, thus if the root schema for the level is a network schema,
// the network handler can download it, and the normal referencing handler may handle references inside of e.g. `if`
// maybe the network handlers adds a generic prop `resolveNetworkRef`, to request network schema inside e.g. an `if` from inside the ReferencingHandler
pluginStack.splice(0, 0, ReferencingNetworkHandler)
customWidgets.pluginStack = pluginStack

const CustomTable: React.ComponentType<WidgetProps> = ({widgets, ...props}) => {
    const customWidgets = React.useMemo(() => ({
        ...widgets,
        types: {
            ...widgets.types,
            string: StringRendererCell,
            number: NumberRendererCell,
            integer: NumberRendererCell,
        },
        custom: {
            ...widgets.custom,
            Text: TextRendererCell,
        },
    }), [widgets])

    return <Table
        {...props}
        widgets={customWidgets}
    />
}

customWidgets.custom.Table = CustomTable
customWidgets.custom.TableAdvanced = TableAdvanced
customWidgets.custom.Stepper = Stepper
customWidgets.custom.Step = Step

//widgets.types.null = () => 'null'

const loadSchema: loadSchemaUIApi = (url, versions) => {
    console.log('Demo loadSchema (url, optional versions)', url, versions)
    return fetch(url).then(r => r.json())
}

const Main = ({classes}: { classes: { paper: string } }) => {
    const {toggleDummy, getDummy} = useDummy()

    return <React.Fragment>
        <Grid item xs={12}>
            <Button style={{marginBottom: 12}} onClick={() => toggleDummy('freeFormEditor')} variant={getDummy('freeFormEditor') ? 'contained' : 'outlined'}>
                FreeFormEditor
            </Button>
            {getDummy('freeFormEditor') ? <Paper className={classes.paper}>
                <Typography component={'p'} variant={'body1'}>
                    One root schema, but rendering the widgets fully manually in the root level, without validating the root object for this strategy, technical limitation.
                </Typography>
                <FreeFormEditor/>
            </Paper> : null}
        </Grid>
    </React.Fragment>
}

const freeFormSchema = createOrderedMap({
    type: 'object',
    name: {
        type: 'string',
    },
    city: {
        type: 'string',
        widget: 'Select',
        enum: ['Berlin', 'Paris', 'Zurich'],
    },
})

const storeKeys = List()

const WidgetTextField = applyPluginStack(StringRenderer)

const FreeFormEditor = () => {
    const [showValidity, setShowValidity] = React.useState(false)
    const [store, setStore] = React.useState(() => createStore(OrderedMap()))

    const onChange = React.useCallback((storeKeys, scopes, updater, deleteOnEmpty, type) => {
        setStore(storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type))
    }, [setStore])

    return <React.Fragment>
        <UIProvider
            store={store}
            onChange={onChange}
            widgets={customWidgets}
            showValidity={showValidity}
            t={browserT}
            schema={freeFormSchema}
        >
            <Grid container dir={'columns'} spacing={4}>
                <WidgetTextField
                    level={1}
                    storeKeys={storeKeys.push('name') as StoreKeys}
                    schema={freeFormSchema.get('name') as unknown as StoreSchemaType}
                    parentSchema={freeFormSchema}

                    // using `applyPluginStack`, this free-form widget is fully typed
                    // with the actual props of the widget component
                    multiline={false}
                />

                <PluginStack
                    showValidity={showValidity}
                    storeKeys={storeKeys.push('city') as StoreKeys}
                    schema={freeFormSchema.get('city') as unknown as StoreSchemaType}
                    parentSchema={freeFormSchema}
                    level={1}
                    readOnly={false}
                    // noGrid={false} (as grid-item is included in `PluginStack`)
                />
            </Grid>

            <MuiSchemaDebug setSchema={() => null}/>
        </UIProvider>

        <div style={{width: '100%'}}>
            <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
            <div>
                {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
            </div>
        </div>
    </React.Fragment>
}

// eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
export default () => <AppTheme>
    <UIApiProvider loadSchema={loadSchema} noCache>
        <Dashboard main={Main}/>
    </UIApiProvider>
</AppTheme>

import React from 'react'
import AppTheme from './layout/AppTheme'
import Dashboard from './dashboard/Dashboard'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { MuiWidgetsBindingCustom, MuiWidgetsBindingTypes, Step, Stepper, widgets } from '@ui-schema/ds-material'
import {
    createOrderedMap,
    WidgetProps,
    loadSchemaUIApi,
    UIMetaProvider,
    UISchema,
    UIStoreProvider,
    createStore,
    storeUpdater,
    isInvalid,
    injectPluginStack,
    UIStoreType,
    StoreSchemaType,
    DefaultHandlerProps,
    WidgetsBindingFactory, onChangeHandler,
} from '@ui-schema/ui-schema'
import { browserT } from '../t'
import { UIApiProvider } from '@ui-schema/ui-schema/UIApi'
import { Table } from '@ui-schema/ds-material/Widgets/Table'
import { NumberRendererCell, StringRendererCell, TextRendererCell } from '@ui-schema/ds-material/Widgets/TextFieldCell'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets/TableAdvanced'
import { InjectSplitSchemaPlugin, InjectSplitSchemaRootContext } from '@ui-schema/ui-schema/Plugins/InjectSplitSchemaPlugin'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { OrderedMap } from 'immutable'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'

type CustomWidgetsBinding = WidgetsBindingFactory<{}, MuiWidgetsBindingTypes<{}>, MuiWidgetsBindingCustom<{}>>
const customWidgets: CustomWidgetsBinding = {...widgets} as CustomWidgetsBinding
const pluginStack = [...customWidgets.pluginStack]
// the referencing network handler should be at first position
// must be before the `ReferencingHandler`, thus if the root schema for the level is a network schema,
// the network handler can download it, and the normal referencing handler may handle references inside of e.g. `if`
// maybe the network handlers adds a generic prop `resolveNetworkRef`, to request network schema inside e.g. an `if` from inside the ReferencingHandler
// pluginStack.splice(0, 0, ReferencingNetworkHandler)
pluginStack.splice(1, 0, InjectSplitSchemaPlugin)
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

const loadSchema: loadSchemaUIApi = (url, versions) => {
    console.log('Demo loadSchema (url, optional versions)', url, versions)
    return fetch(url).then(r => r.json())
}

const schemaData = createOrderedMap({
    // id is not needed when using the `rootContext` prop
    //id: 'https://example.org/schema/split-schema',
    type: 'object',
    properties: {
        name: {
            type: 'string',
            default: 'Max',
        },
        postal_code: {
            type: ['null', 'string'],
            //default: null,
        },
        city: {
            type: 'string',
        },
    },
    required: ['name', 'postal_code'],
}) as unknown as StoreSchemaType

const schemaStyle = createOrderedMap({
    '': {
        widget: 'FormGroup',
        title: 'Address',
    },
    '/name': {
        view: {
            sizeMd: 12,
        },
    },
    '/postal_code': {
        view: {
            sizeMd: 3,
        },
    },
    '/city': {
        view: {
            sizeMd: 9,
        },
    },
} as { [k: string]: UISchema })

// keep the `rootContext` reference integration!
// e.g. be sure it does not force a re-render of the root plugin stack, with `React.useMemo` and maybe `useImmutable`
const rootContext: InjectSplitSchemaRootContext = {schemaStyle: schemaStyle as StoreSchemaType}

export type CustomConfig = Partial<DefaultHandlerProps>

const GridStack = injectPluginStack(GridContainer)
const Main = () => {
    const [showValidity, setShowValidity] = React.useState(false)

    const [store, setStore] = React.useState((): UIStoreType => createStore(OrderedMap()))

    const onChange: onChangeHandler = React.useCallback((actions) => {
        setStore((prevStore: UIStoreType) => {
            return storeUpdater(actions)(prevStore)
        })
    }, [setStore])

    return <React.Fragment>
        <Grid item xs={12}>
            <UIStoreProvider<CustomConfig>
                store={store}
                onChange={onChange}
                showValidity={showValidity}
                //doNotDefault
            >
                <GridStack<{ rootContext?: InjectSplitSchemaRootContext }>
                    isRoot
                    schema={schemaData}
                    rootContext={rootContext}
                />
                <MuiSchemaDebug schema={schemaData}/>
            </UIStoreProvider>

            <div style={{width: '100%'}}>
                <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
                <div>
                    {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
                </div>
            </div>
        </Grid>
    </React.Fragment>
}

// eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
export default () => <AppTheme>
    <UIMetaProvider widgets={customWidgets} t={browserT}>
        <UIApiProvider loadSchema={loadSchema} noCache>
            <Dashboard main={Main}/>
        </UIApiProvider>
    </UIMetaProvider>
</AppTheme>

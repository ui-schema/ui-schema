import React from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import * as WidgetsDefault from '@ui-schema/ds-material/WidgetsDefault'
import { MuiWidgetsBindingCustom, MuiWidgetsBindingTypes } from '@ui-schema/ds-material/BindingType'
import { browserT } from '../t'
import { loadSchemaUIApi, UIApiProvider } from '@ui-schema/react/UIApi'
import { Table } from '@ui-schema/ds-material/Widgets/Table'
import { NumberRendererCell, StringRendererCell, TextRendererCell } from '@ui-schema/ds-material/Widgets/TextFieldCell'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets/TableAdvanced'
import { InjectSplitSchemaPlugin, InjectSplitSchemaRootContext } from '@ui-schema/react-json-schema/InjectSplitSchemaPlugin'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { OrderedMap } from 'immutable'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { InfoRenderer, InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'
import { SelectChips } from '@ui-schema/ds-material/Widgets'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { UISchema, UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { DefaultHandlerProps } from '@ui-schema/react-json-schema/DefaultHandler'
import { injectWidgetEngine } from '@ui-schema/react/applyWidgetEngine'
import { createStore, onChangeHandler, UIStoreProvider, UIStoreType } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { isInvalid } from '@ui-schema/react/ValidityReporter'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'

type CustomWidgetsBinding = WidgetsBindingFactory<{}, MuiWidgetsBindingTypes<{}>, MuiWidgetsBindingCustom<{}>>

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
const {widgetPlugins, schemaPlugins} = WidgetsDefault.plugins()
const customWidgets = WidgetsDefault.define<{ InfoRenderer?: React.ComponentType<InfoRendererProps> }, {}>({
    InfoRenderer: InfoRenderer,
    // the referencing network handler should be at first position
    // must be before the `ReferencingHandler`, thus if the root schema for the level is a network schema,
    // the network handler can download it, and the normal referencing handler may handle references inside of e.g. `if`
    // maybe the network handlers adds a generic prop `resolveNetworkRef`, to request network schema inside e.g. an `if` from inside the ReferencingHandler
    // widgetPlugins.splice(0, 0, ReferencingNetworkHandler)
    // widgetPlugins.splice(1, 0, InjectSplitSchemaPlugin)
    widgetPlugins: [InjectSplitSchemaPlugin, ...widgetPlugins],
    schemaPlugins: schemaPlugins,
    types: WidgetsDefault.widgetsTypes(),
    custom: {
        ...WidgetsDefault.widgetsCustom(),
        SelectChips: SelectChips,
        Table: CustomTable,
        TableAdvanced: TableAdvanced,
    },
}) as CustomWidgetsBinding

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
}) as unknown as UISchemaMap

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
const rootContext: InjectSplitSchemaRootContext = {schemaStyle: schemaStyle as UISchemaMap}

export type CustomConfig = Partial<DefaultHandlerProps>

const GridStack = injectWidgetEngine(GridContainer)
const Main = () => {
    const [showValidity, setShowValidity] = React.useState(false)

    const [store, setStore] = React.useState((): UIStoreType => createStore(OrderedMap()))

    const onChange: onChangeHandler = React.useCallback((actions) => {
        setStore((prevStore: UIStoreType) => {
            return storeUpdater(actions)(prevStore)
        })
    }, [setStore])

    return <React.Fragment>
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
    </React.Fragment>
}

// eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
export default () => <>
    <UIMetaProvider widgets={customWidgets} t={browserT}>
        <UIApiProvider loadSchema={loadSchema} noCache>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Main/>
                </Grid>
            </Grid>
        </UIApiProvider>
    </UIMetaProvider>
</>

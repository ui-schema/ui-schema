import { escapePointer } from '@ui-schema/json-pointer'
import { resourceFromSchema, SchemaResource } from '@ui-schema/json-schema/SchemaResource'
import { SchemaGridHandler } from '@ui-schema/ds-material/Grid'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import { requiredValidatorLegacy } from '@ui-schema/json-schema/Validators/RequiredValidatorLegacy'
import { ReferencingHandler } from '@ui-schema/react-json-schema/ReferencingHandler'
import { DefaultHandler, DefaultHandlerProps } from '@ui-schema/react-json-schema/DefaultHandler'
import { requiredPlugin } from '@ui-schema/react-json-schema/RequiredPlugin'
import { SchemaResourceProvider } from '@ui-schema/react-json-schema/SchemaResourceProvider'
import { validatorPlugin } from '@ui-schema/react-json-schema/ValidatorPlugin'
import { SchemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { WidgetPayload } from '@ui-schema/system/Widget'
import React, { useMemo } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import * as WidgetsDefault from '@ui-schema/ds-material/WidgetsDefault'
import { MuiWidgetsBindingCustom, MuiWidgetsBindingTypes } from '@ui-schema/ds-material/BindingType'
import { browserT } from '../t'
import { Table } from '@ui-schema/ds-material/Widgets/Table'
import { NumberRendererCell, StringRendererCell, TextRendererCell } from '@ui-schema/ds-material/Widgets/TextFieldCell'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets/TableAdvanced'
import { InjectSplitSchemaPlugin, InjectSplitSchemaRootContext } from '@ui-schema/react-json-schema/InjectSplitSchemaPlugin'
import { MuiJsonEditor, MuiSchemaDebug } from './component/MuiSchemaDebug'
import { Map, OrderedMap } from 'immutable'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { InfoRenderer, InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'
import { SelectChips } from '@ui-schema/ds-material/Widgets'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { UISchema, UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { injectWidgetEngine } from '@ui-schema/react/applyWidgetEngine'
import { createStore, onChangeHandler, UIStoreProvider, UIStoreType } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { isInvalid, ValidityReporter } from '@ui-schema/react/ValidityReporter'
import { UIMetaContext, UIMetaProvider } from '@ui-schema/react/UIMeta'

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
// const {widgetPlugins} = WidgetsDefault.plugins()
const customWidgets = WidgetsDefault.define<{ InfoRenderer?: React.ComponentType<InfoRendererProps> }, {}>({
    InfoRenderer: InfoRenderer,
    // the referencing network handler should be at first position
    // must be before the `ReferencingHandler`, thus if the root schema for the level is a network schema,
    // the network handler can download it, and the normal referencing handler may handle references inside of e.g. `if`
    // maybe the network handlers adds a generic prop `resolveNetworkRef`, to request network schema inside e.g. an `if` from inside the ReferencingHandler
    // widgetPlugins.splice(0, 0, ReferencingNetworkHandler)
    // widgetPlugins.splice(1, 0, InjectSplitSchemaPlugin)
    widgetPlugins: [
        ReferencingHandler, //  needed for legacy widget plugin, as relying on RootProvider/rootContext handling from it
        DefaultHandler,
        SchemaPluginsAdapterBuilder([
            validatorPlugin,
            requiredPlugin,
            {
                handle: ({styleSchema, schema, storeKeys}) => {
                    if (!styleSchema) return {}
                    const pointer = storeKeys?.size ? '/' + storeKeys.map(k => escapePointer(String(k))).join('/') : ''
                    const schemaStyleLevel = styleSchema?.get(pointer) as Map<string, any> | undefined
                    let schemaStyleClean: UISchemaMap | undefined
                    if (schemaStyleLevel && Map.isMap(schemaStyleLevel)) {
                        schemaStyleClean = schemaStyleLevel
                            .delete('properties')
                            .delete('items')
                            .delete('if')
                            .delete('else')
                            .delete('then')
                            .delete('not')
                            .delete('allOf')
                            .delete('anyOf')
                            .delete('required')
                    }
                    return {
                        schema: schemaStyleClean ? schema?.mergeDeep(schemaStyleClean) || schemaStyleClean : schema,
                    }
                },
            } satisfies SchemaPlugin<WidgetPayload & { resource?: SchemaResource, styleSchema?: UISchemaMap }>,
        ]),
        InjectSplitSchemaPlugin, // legacy widget plugin
        SchemaGridHandler,
        ValidityReporter,
        WidgetRenderer,
    ],
    types: WidgetsDefault.widgetsTypes(),
    custom: {
        ...WidgetsDefault.widgetsCustom(),
        SelectChips: SelectChips,
        Table: CustomTable,
        TableAdvanced: TableAdvanced,
    },
}) as CustomWidgetsBinding

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

const styleSchema = createOrderedMap({
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

const validate = Validator([
    ...standardValidators,
    requiredValidatorLegacy,
]).validate

export type CustomConfig = Partial<DefaultHandlerProps>

const GridStack = injectWidgetEngine(GridContainer)
const Main = () => {
    const [legacy, setShowLegacy] = React.useState(false)
    const [showValidity, setShowValidity] = React.useState(false)

    const [styleSchemaActive, setStyleSchemaActive] = React.useState((): UISchemaMap => styleSchema)
    const [store, setStore] = React.useState((): UIStoreType => createStore(OrderedMap()))
    const resource = useMemo(() => (schemaData ? resourceFromSchema(schemaData, {}) : undefined), [])

    const onChange: onChangeHandler = React.useCallback((actions) => {
        setStore((prevStore: UIStoreType) => {
            return storeUpdater(actions)(prevStore)
        })
    }, [setStore])

    // keep the `rootContext` reference integrity!
    // e.g. be sure it does not force a re-render of the root plugin stack, with `React.useMemo` and maybe `useImmutable`
    const rootContext = useMemo(
        (): InjectSplitSchemaRootContext => ({schemaStyle: styleSchemaActive as UISchemaMap}),
        [styleSchemaActive],
    )

    return <React.Fragment>
        <Button size={'small'} sx={{mb: 3}} onClick={() => setShowLegacy(s => !s)}>{legacy ? 'switch to schema-plugin' : 'switch to widget-plugin'}</Button>

        <UIMetaProvider<UIMetaContext & { styleSchema?: UISchemaMap }>
            widgets={customWidgets}
            t={browserT}
            validate={validate}
            // new injection, for schema plugin
            styleSchema={legacy ? undefined : styleSchemaActive}
        >
            <UIStoreProvider<CustomConfig>
                store={store}
                onChange={onChange}
                showValidity={showValidity}
                //doNotDefault
            >
                <SchemaResourceProvider
                    // schema={schema}
                    resource={resource}
                    // loadSchema={loadSchema}
                >
                    <GridStack<{ rootContext?: InjectSplitSchemaRootContext }>
                        isRoot
                        schema={schemaData}
                        // injection for legacy widget plugin, which used RootProvider
                        rootContext={legacy ? rootContext : undefined}
                    />
                </SchemaResourceProvider>

                <MuiJsonEditor
                    title={<code>styleSchema</code>}
                    data={styleSchemaActive}
                    getVal={keys => styleSchemaActive.getIn(keys)}
                    onChange={(keys, value) => setStyleSchemaActive(styleSchemaActive => styleSchemaActive.setIn(keys, value))}
                />

                <MuiSchemaDebug schema={schemaData}/>
            </UIStoreProvider>
        </UIMetaProvider>

        <div style={{width: '100%'}}>
            <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
            <div>
                {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
            </div>
        </div>
    </React.Fragment>
}

// eslint-disable-next-line react/display-name
export default () => <>
    <Grid container spacing={3}>
        <Grid item xs={12}>
            <Main/>
        </Grid>
    </Grid>
</>

import React from 'react'
import AppTheme from './layout/AppTheme'
import Dashboard from './layout/Dashboard'
import { schemaUser } from '../schemas/demoMain'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { List } from 'immutable'
import { createOrderedMap, createMap } from '@ui-schema/system/createMap'
import { isInvalid, ValidityReporter } from '@ui-schema/react/ValidityReporter'
import { createStore, UIStoreProvider, WithValue } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { browserT } from '../t'
import { UIApiProvider } from '@ui-schema/react/UIApi'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetEngine, WidgetsProvider } from '@ui-schema/react/WidgetEngine'
import { ErrorFallback } from '@ui-schema/ds-material/ErrorFallback'
import { GroupRenderer, SchemaGridHandler } from '@ui-schema/ds-material/Grid'
// import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
// import { VirtualWidgetRenderer } from '@ui-schema/react/VirtualWidgetRenderer'
import { NoWidget } from '@ui-schema/react/NoWidget'
import { BoolRenderer } from '@ui-schema/ds-material/Widgets/OptionsBoolean'
import { NumberRenderer, StringRenderer, TextRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { InfoRenderer } from '@ui-schema/ds-material/Component/InfoRenderer'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import { StoreKeys } from '@ui-schema/system/ValueStore'
import { DecoratorPropsNext, ReactDeco } from '@tactic-ui/react/Deco'
import { LeafsRenderMapping } from '@tactic-ui/react/LeafsEngine'
import { ExtractStorePlugin } from '@ui-schema/react/ExtractStorePlugin'
import { MuiComponentsBinding, NextMuiWidgetsBinding } from '@ui-schema/ds-material/WidgetsBinding'
import { SchemaPluginsAdapter } from '@ui-schema/react/SchemaPluginsAdapter'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { getValidators } from '@ui-schema/json-schema/getValidators'
import { memo } from '@ui-schema/react/Utils/memo'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'
import { SchemaValidatorContext } from '@ui-schema/system/SchemaPluginStack'
import { CombiningHandler, ConditionalHandler, DefaultHandler, DependentHandler, ReferencingHandler } from '@ui-schema/react-json-schema'
import { DummyRenderer } from './component/MuiMainDummy'
import { schemaDemoReferencing, schemaDemoReferencingNetwork, schemaDemoReferencingNetworkB } from '../schemas/demoReferencing'
import { useToggle } from '../component/useToggle'
import { FormGroup } from '@ui-schema/ds-material/Widgets'
import { schemaNumberSlider } from '../schemas/demoNumberSlider'
import { schemaLists } from '../schemas/demoLists'
import { schemaWCombining } from '../schemas/demoCombining'
import { schemaWConditional, schemaWConditional1, schemaWConditional2 } from '../schemas/demoConditional'
import { schemaWDep1, schemaWDep2 } from '../schemas/demoDependencies'
import { schemaGrid } from '../schemas/demoGrid'
import { schemaNull, schemaSimBoolean, schemaSimCheck, schemaSimInteger, schemaSimNumber, schemaSimRadio, schemaSimSelect, schemaSimString } from '../schemas/demoSimples'

export type CustomComponents = {
    // InfoRenderer?: ReactLeafDefaultNodeType<InfoRendererProps>
}

// todo: the binding needs to be fully specified beforehand, as otherwise circular relations won't work
export const renderMapping: NextMuiWidgetsBinding<
    {},
    {
        /* this typing is the "custom meta typing", which can be used to specify anything "injected" */
        renderMap: LeafsRenderMapping<{}, MuiComponentsBinding>
    },
    CustomComponents
> = {
    leafs: {
        // if no custom widget is specified, the `DemoRenderer` below suffixes `type:` before the schema `type` to access `leafs`
        'type:string': StringRenderer,
        'type:boolean': BoolRenderer as React.FC<WidgetProps>,
        'type:number': NumberRenderer,
        'type:integer': NumberRenderer,
        'type:object': ObjectRenderer,
        // note this annoying behaviour:
        // 'type:object': ObjectRenderer as React.FC<WidgetProps>, // works, props of widget can have less than defined in data map
        // 'type:object': ObjectRenderer as React.ComponentType<WidgetProps>, // fails, props of widget must contain all props, like in the next line
        // 'type:object': ObjectRenderer as React.ComponentType<WidgetProps & { renderMap: LeafsRenderMapping<{}, MuiComponentsBinding> }>,

        // the `DemoRenderer` below uses `custom` widgets as is to access `leafs`
        Text: TextRenderer,
        FormGroup: FormGroup,
    },
    components: {
        ErrorFallback: ErrorFallback,
        GroupRenderer: GroupRenderer,
        // WidgetRenderer: WidgetRenderer,
        // VirtualRenderer: VirtualWidgetRenderer,
        NoWidget: NoWidget,
        InfoRenderer: InfoRenderer,
    },
}

const WidgetEngineMemo = memo(WidgetEngine)

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false)
    const [store, setStore] = React.useState(() => createStore(createMap({name: 'Jane', address: {street_no: '5a'}})))
    const [schema, setSchema] = React.useState<UISchemaMap>(() => createOrderedMap(schemaUser) as UISchemaMap)

    const onChange = React.useCallback((actions) => {
        setStore(oldStore => {
            const newStore = storeUpdater(actions)(oldStore)
            console.log('newStore', newStore.valuesToJS())
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
                {/*<GridStack isRoot schema={schema}/>*/}
                <Grid container spacing={2}>
                    <WidgetEngineMemo
                        storeKeys={List([]) as StoreKeys}
                        schemaKeys={List([]) as StoreKeys}
                        schema={schema}
                        parentSchema={undefined}
                        required={false}
                        t={browserT}
                        isVirtual={false}
                        noGrid={false}
                    />
                </Grid>

                <Button onClick={() => setShowValidity(!showValidity)}>{showValidity ? 'hide ' : ''}validity</Button>
                {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
            </Paper>

            <MuiSchemaDebug setSchema={setSchema} schema={schema}/>
        </UIStoreProvider>
    </React.Fragment>
}

const loadSchema = (url: string, versions?: string[]) => {
    console.log('Demo loadSchema (url, optional versions)', url, versions)
    return fetch(url).then(r => r.json())
}

type DemoRendererProps = {
    // todo: try to make the render typing a bit stricter without circular CustomLeafProps import dependencies
    renderMap: typeof renderMapping
    // renderMap: LeafsRenderMapping<ReactLeafsNodeSpec<{ [k: string]: {} }>, {}>
}

function DemoRenderer<P extends DecoratorPropsNext & WidgetProps & WithValue & SchemaValidatorContext>(
    {
        // we do not want `value`/`internalValue` to be passed to non-scalar widgets for performance reasons
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        value, internalValue,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next, decoIndex,
        ...p
    }: P & DemoRendererProps,
): React.ReactElement<P> {
    // the last decorator must end the run - decorators afterwards are skipped silently
    const {schema, renderMap} = p

    const schemaType = schema?.get('type') as SchemaTypesType | undefined
    const schemaWidget = schema?.get('widget')
    // console.log('schemaType', schemaType, schemaWidget, renderMap.leafs)
    // todo: for usage in e.g. `FormGroup` the matcher should be in the props or renderMap
    const getWidget = (): React.ComponentType<Omit<P, keyof DecoratorPropsNext> & DemoRendererProps> => {
        let matching: string | undefined
        if (typeof schemaWidget === 'string') {
            matching = schemaWidget
        } else if (typeof schemaType === 'string') {
            matching = 'type:' + schemaType
        }
        if (matching && renderMap.leafs[matching]) {
            return renderMap.leafs[matching] as any
        }
        if (renderMap.components.NoWidget) {
            const NoWidget = renderMap.components.NoWidget
            // todo: use a better way to add the extra NoWidgetProps
            return function NoWidgetWrap(p) {
                return <NoWidget {...p} matching={matching}/>
            }
        }
        throw new Error('No Widget found.')
    }
    const Widget = getWidget()

    const noExtractValue = !p.isVirtual && (
        schemaType === 'array' || schemaType === 'object' ||
        (
            List.isList(schemaType) && (
                schemaType.indexOf('array') !== -1 ||
                schemaType.indexOf('object') !== -1
            )
        )
    )

    return <Widget
        {...p as Omit<P, keyof DecoratorPropsNext> & DemoRendererProps}
        value={noExtractValue ? undefined : value}
        internalValue={noExtractValue ? undefined : internalValue}
    />
}

const schemaPlugins: SchemaPlugin[] = getValidators()

const deco = new ReactDeco<
    DecoratorPropsNext &
    {
        renderMap: typeof renderMapping
        // renderMap: LeafsRenderMapping<ReactLeafsNodeSpec<{ [k: string]: {} }>, CustomComponents>
    } &
    WidgetProps
>()
    // todo: use another way to configure the schemaPlugins, should be `props` based but not introduce another context if possible (waits for new, strict typed, SchemaPlugins)
    .use(function SetSchemaPlugins<P extends DecoratorPropsNext>(props: P): React.ReactElement<P & { schemaPlugins: SchemaPlugin[] }> {
        const Next = props.next(props.decoIndex + 1)
        return <Next
            {...props} decoIndex={props.decoIndex + 1}
            schemaPlugins={schemaPlugins}
        />
    })
    .use(ReferencingHandler)
    .use(SchemaGridHandler)
    .use(ExtractStorePlugin)
    .use(memo(CombiningHandler) as typeof CombiningHandler)
    .use(DefaultHandler)
    .use(DependentHandler)
    .use(ConditionalHandler)
    .use(SchemaPluginsAdapter)
    .use(ValidityReporter)
    .use(DemoRenderer)

export default function MaterialDemo() {
    const [toggle, getToggle] = useToggle()

    return <AppTheme>
        {/* todo make the typing stricter and easier (check tactic-ui comments) */}
        {/*<WidgetsProvider<NextMuiWidgetsBinding<{}, { renderMap: LeafsRenderMapping<{}, MuiComponentsBinding> }, typeof renderMapping.components>['leafs'], typeof renderMapping.components, typeof deco>*/}
        <WidgetsProvider
            deco={deco}
            renderMap={renderMapping}
        >
            <UIMetaProvider t={browserT}>
                {/* todo: move to `UIMeta`? */}
                <UIApiProvider loadSchema={loadSchema} noCache>
                    <Dashboard>
                        <Grid item xs={12}>
                            <MainStore/>
                        </Grid>
                        <Grid item xs={12}>
                            <DummyRenderer
                                id={'schemaReferencingNetwork'} schema={schemaDemoReferencingNetwork}
                                toggleDummy={toggle} getDummy={getToggle}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <DummyRenderer
                                id={'schemaReferencingNetworkB'} schema={schemaDemoReferencingNetworkB}
                                toggleDummy={toggle} getDummy={getToggle}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <DummyRenderer id={'schemaReferencing'} schema={schemaDemoReferencing} toggleDummy={toggle} getDummy={getToggle}/>
                        </Grid>
                        <Grid item xs={12}>
                            <DummyRenderer id={'schemaNumberSlider'} schema={schemaNumberSlider} toggleDummy={toggle} getDummy={getToggle}/>
                        </Grid>
                        <Grid item xs={12}>
                            <DummyRenderer id={'schemaLists'} schema={schemaLists} toggleDummy={toggle} getDummy={getToggle} open/>
                        </Grid>
                        <Grid item xs={12}>
                            <DummyRenderer id={'schemaWCombining'} schema={schemaWCombining} toggleDummy={toggle} getDummy={getToggle}/>
                        </Grid>
                        <Grid item xs={12}>
                            <DummyRenderer id={'schemaWConditional'} schema={schemaWConditional} toggleDummy={toggle} getDummy={getToggle}/>
                        </Grid>
                        <Grid item xs={12}>
                            <DummyRenderer id={'schemaWConditional1'} schema={schemaWConditional1} toggleDummy={toggle} getDummy={getToggle}/>
                        </Grid>
                        <Grid item xs={12}>
                            <DummyRenderer id={'schemaWConditional2'} schema={schemaWConditional2} toggleDummy={toggle} getDummy={getToggle}/>
                        </Grid>
                        <Grid item xs={12}>
                            <DummyRenderer id={'schemaWDep1'} schema={schemaWDep1} toggleDummy={toggle} getDummy={getToggle}/>
                        </Grid>
                        <Grid item xs={12}>
                            <DummyRenderer id={'schemaWDep2'} schema={schemaWDep2} toggleDummy={toggle} getDummy={getToggle}/>
                        </Grid>
                        <Grid item xs={12}>
                            <DummyRenderer id={'schemaGrid'} schema={schemaGrid(12)} toggleDummy={toggle} getDummy={getToggle}/>
                        </Grid>
                        <Grid item xs={12}>
                            <DummyRenderer id={'schemaSimString'} schema={schemaSimString} toggleDummy={toggle} getDummy={getToggle}/>
                            <DummyRenderer id={'schemaSimBoolean'} schema={schemaSimBoolean} toggleDummy={toggle} getDummy={getToggle}/>
                            <DummyRenderer id={'schemaSimCheck'} schema={schemaSimCheck} toggleDummy={toggle} getDummy={getToggle}/>
                            <DummyRenderer id={'schemaSimNumber'} schema={schemaSimNumber} toggleDummy={toggle} getDummy={getToggle}/>
                            <DummyRenderer id={'schemaSimInteger'} schema={schemaSimInteger} toggleDummy={toggle} getDummy={getToggle}/>
                            <DummyRenderer id={'schemaSimRadio'} schema={schemaSimRadio} toggleDummy={toggle} getDummy={getToggle}/>
                            <DummyRenderer id={'schemaSimSelect'} schema={schemaSimSelect} toggleDummy={toggle} getDummy={getToggle}/>
                        </Grid>
                        <Grid item xs={12}>
                            <DummyRenderer id={'schemaNull'} schema={schemaNull} toggleDummy={toggle} getDummy={getToggle}/>
                        </Grid>
                    </Dashboard>
                </UIApiProvider>
            </UIMetaProvider>
        </WidgetsProvider>
    </AppTheme>
}

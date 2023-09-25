import React from 'react'
import AppTheme from './layout/AppTheme'
import Dashboard from './layout/Dashboard'
import { schemaUser } from '../schemas/demoMain'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { List } from 'immutable'
import { createOrderedMap, createMap } from '@ui-schema/system/createMap'
import { isInvalid } from '@ui-schema/react/ValidityReporter'
import { createStore, UIStoreProvider } from '@ui-schema/react/UIStore'
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

// todo: replace this / all `WidgetEngine` with a new plugin structure - maybe applied PER WIDGET?!

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false)
    const [store, setStore] = React.useState(() => createStore(createMap({address: {street_no: '5a'}})))
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
                    <WidgetEngine
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

function DemoRenderer<P extends DecoratorPropsNext & WidgetProps>(
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next, decoIndex,
        ...p
    }: P & DemoRendererProps,
): React.ReactElement<P> {
    // the last decorator must end the run - decorators afterwards are skipped silently
    const {schema, renderMap} = p
    // todo: try using the `widgetMatcher` base in uis-system/src-tmp
    const schemaType = schema?.get('type') as string | undefined
    const schemaWidget = schema?.get('widget')
    // console.log('schemaType', schemaType, schemaWidget, renderMap.leafs)
    const getWidget = (): React.ComponentType<Omit<P, keyof DecoratorPropsNext> & DemoRendererProps> => {
        let matching: string | undefined
        if (schemaWidget) {
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
    return <Widget {...p}/>
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
    // todo: use another way to configure the schemaPlugins, should be `props` based but not introduce another context if possible
    .use(<P extends DecoratorPropsNext>(props: P): React.ReactElement<P & { schemaPlugins: SchemaPlugin[] }> => {
        const Next = props.next(props.decoIndex + 1)
        return <Next
            {...props} decoIndex={props.decoIndex + 1}
            schemaPlugins={schemaPlugins}
        />
    })
    .use(SchemaGridHandler)
    .use(ExtractStorePlugin)
    .use(SchemaPluginsAdapter)
    .use(DemoRenderer)

export default function MaterialDemo() {
    return <AppTheme>
        {/* todo make the typing stricter and easier */}
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
                    </Dashboard>
                </UIApiProvider>
            </UIMetaProvider>
        </WidgetsProvider>
    </AppTheme>
}

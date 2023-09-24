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
import { InfoRenderer, InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { CustomLeafsRenderMapping, WidgetEngine, WidgetsProvider } from '@ui-schema/react/UIEngine'
import { ErrorFallback } from '@ui-schema/ds-material/ErrorFallback'
import { GroupRenderer, SchemaGridHandler } from '@ui-schema/ds-material/Grid'
// import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
// import { VirtualWidgetRenderer } from '@ui-schema/react/VirtualWidgetRenderer'
import { NoWidget } from '@ui-schema/react/NoWidget'
import { BoolRenderer } from '@ui-schema/ds-material/Widgets/OptionsBoolean'
import { NumberRenderer, StringRenderer, TextRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import { StoreKeys } from '@ui-schema/system/ValueStore'
import { createValidatorErrors } from '@ui-schema/system/ValidatorErrors'
import { DecoratorPropsNext, ReactDeco } from '@tactic-ui/react/Deco'
import { ExtractStorePlugin } from '@ui-schema/react/ExtractStorePlugin'
import { MuiComponentsBinding, NextMuiWidgetsBinding } from '@ui-schema/ds-material/WidgetsBinding'

export type CustomComponents = {
    InfoRenderer?: React.ComponentType<InfoRendererProps>
}

// todo: the binding needs to be fully specified beforehand, as otherwise circular relations won't work
export const renderMapping: NextMuiWidgetsBinding<
    {},
    {
        /* this typing is the "custom meta typing", which can be used to specify anything "injected" */
        render: CustomLeafsRenderMapping<{}, MuiComponentsBinding>
    },
    CustomComponents
> = {
    leafs: {
        // if now custom widget is specified, the `DemoRenderer` below suffixes `type:` before the schema `type` to access `leafs`
        'type:string': StringRenderer,
        'type:boolean': BoolRenderer as React.FC<WidgetProps>,
        'type:number': NumberRenderer,
        'type:integer': NumberRenderer,
        'type:object': ObjectRenderer,
        // the `DemoRenderer` below uses `custom` widgets as is to access `leafs`
        Text: TextRenderer,

        // todo: somehow `ComponentType` isn't compatible
        // 'type:object': ObjectRenderer as React.ComponentType<WidgetProps>,
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
                        errors={createValidatorErrors()}
                        showValidity={false}
                        t={browserT}
                        isVirtual={false}
                        noGrid={false}
                        valid
                    />
                </Grid>

                <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
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
    render: typeof renderMapping
    // render: CustomLeafsRenderMapping<ReactLeafsNodeSpec<{ [k: string]: {} }>, {}>
    schema?: any
}

function DemoRenderer<P extends DecoratorPropsNext>(
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next, decoIndex,
        ...p
    }: P & DemoRendererProps,
): React.ReactElement<P> {
    // the last decorator must end the run - decorators afterwards are skipped silently
    const {schema, render} = p
    // todo: try using the `widgetMatcher` base in uis-system/src-tmp
    const schemaType = schema?.get('type') as string | undefined
    const schemaWidget = schema?.get('widget')
    // console.log('schemaType', schemaType, schemaWidget, render.leafs)
    const getWidget = (): any => {
        let matching: string | undefined
        if (schemaWidget) {
            matching = schemaWidget
        } else if (typeof schemaType === 'string') {
            matching = 'type:' + schemaType
        }
        if (matching && render.leafs[matching]) {
            return render.leafs[matching]
        }
        if (render.components.NoWidget) {
            const NoWidget = render.components.NoWidget
            // todo: use a better way to add the extra NoWidgetProps
            return function NoWidgetWrap(p) {
                return <NoWidget{...p} matching={matching}/>
            }
        }
        throw new Error('No Widget found.')
    }
    const Widget = getWidget()
    return <Widget {...p}/>
}

const deco = new ReactDeco<
    DecoratorPropsNext &
    // DemoDecoratorProps &
    // CustomLeafDataType<string> &
    {
        render: typeof renderMapping
        // render: CustomLeafsRenderMapping<ReactLeafsNodeSpec<{ [k: string]: {} }>, CustomComponents>
    } &
    {
        storeKeys: StoreKeys
        schema: UISchemaMap
    }
>()
    .use(SchemaGridHandler)
    .use(ExtractStorePlugin)
    .use(DemoRenderer)

export default function materialDemo() {
    return <AppTheme>
        {/*<WidgetsProvider<{ [K in keyof typeof renderMapping.leafs]: React.ComponentProps<NonNullable<typeof renderMapping.leafs[K]>> }, typeof renderMapping.components, typeof renderMapping>*/}
        <WidgetsProvider<{ [K in keyof typeof renderMapping.leafs]: React.ComponentProps<NonNullable<typeof renderMapping.leafs[K]>> }>
            deco={deco}
            // todo: fix in tactic-ui
            // @ts-ignore
            render={renderMapping}
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

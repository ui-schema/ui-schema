import React from 'react'
import AppTheme from './layout/AppTheme'
import Dashboard from './layout/Dashboard'
import { schemaUser } from '../schemas/demoMain'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { List } from 'immutable'
// import * as WidgetsDefault from '@ui-schema/ds-material/WidgetsDefault'
import { createOrderedMap, createMap } from '@ui-schema/system/createMap'
import { isInvalid } from '@ui-schema/react/ValidityReporter'
import { createStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
// import { MuiSchemaDebug } from './component/MuiSchemaDebug'
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
import { NumberRenderer, StringRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import { StoreKeys } from '@ui-schema/system/ValueStore'
import { createValidatorErrors } from '@ui-schema/system/ValidatorErrors'
import { DecoratorPropsNext, ReactDeco } from '@tactic-ui/react/Deco'
import { ReactLeafsNodeSpec } from '@tactic-ui/react/LeafsEngine'
import { ExtractStorePlugin } from '@ui-schema/react/ExtractStorePlugin'

export type CustomComponents = {
    InfoRenderer?: React.ComponentType<InfoRendererProps>
}

export const renderMapping: CustomLeafsRenderMapping = {
    leafs: {
        typeString: StringRenderer as React.FC<WidgetProps>,
        typeBoolean: BoolRenderer as React.FC<WidgetProps>,
        typeNumber: NumberRenderer as React.FC<WidgetProps>,
        typeInteger: NumberRenderer as React.FC<WidgetProps>,
        typeObject: ObjectRenderer as React.FC<WidgetProps>,
        // todo: somehow `ComponentType` isn't compatible
        // typeObject: ObjectRenderer as React.ComponentType<WidgetProps>,
        // ...WidgetsDefault.widgetsCustom(),
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
    const [store, setStore] = React.useState(() => createStore(createMap({name: 'Taka'})))
    const [schema] = React.useState<UISchemaMap>(() => createOrderedMap(schemaUser) as UISchemaMap)

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return <React.Fragment>
        <UIStoreProvider
            store={store}
            onChange={onChange}
            showValidity={showValidity}
            //doNotDefault
        >
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
            {/*<GridStack isRoot schema={schema}/>*/}
            {/*<MuiSchemaDebug setSchema={setSchema} schema={schema}/>*/}
        </UIStoreProvider>

        <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
        {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}

    </React.Fragment>
}

const loadSchema = (url: string, versions?: string[]) => {
    console.log('Demo loadSchema (url, optional versions)', url, versions)
    return fetch(url).then(r => r.json())
}

type DemoRendererProps = {
    // todo: try to make the render typing a bit stricter without circular CustomLeafProps import dependencies
    render: CustomLeafsRenderMapping<ReactLeafsNodeSpec<{ [k: string]: {} }>, {}>
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
        if (schemaWidget && render.leafs[schemaWidget]) {
            return render.leafs[schemaWidget]
        }
        if (typeof schemaType === 'string') {
            const widgetName = 'type' + schemaType.slice(0, 1).toUpperCase() + schemaType.slice(1)
            if (render.leafs[widgetName]) {
                return render.leafs[widgetName]
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
        render: CustomLeafsRenderMapping<ReactLeafsNodeSpec<{ [k: string]: {} }>, CustomComponents>
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
        <WidgetsProvider
            deco={deco}
            render={renderMapping}
        >
            <UIMetaProvider t={browserT}>
                {/* todo: move to `UIMeta`? */}
                <UIApiProvider loadSchema={loadSchema} noCache>
                    <Dashboard>
                        <Grid item xs={12}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    overflow: 'auto',
                                    flexDirection: 'column',
                                }}
                            >
                                <MainStore/>
                            </Paper>
                        </Grid>
                    </Dashboard>
                </UIApiProvider>
            </UIMetaProvider>
        </WidgetsProvider>
    </AppTheme>
}

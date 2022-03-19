import React from 'react'
import AppTheme from './layout/AppTheme'
import Dashboard from './dashboard/Dashboard'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'
import { MuiWidgetBinding, MuiWidgetsBindingCustom, MuiWidgetsBindingTypes, Select, Step, Stepper, widgets } from '@ui-schema/ds-material'
import {
    createOrderedMap, createStore,
    StoreKeys, StoreSchemaType, WidgetProps,
    UIMetaProvider, UIStoreProvider, useUIMeta,
    WithValue, extractValue,
    WidgetsBindingFactory, WithScalarValue, onChangeHandler,
} from '@ui-schema/ui-schema'
import { browserT } from '../t'
import { UIApiProvider, loadSchemaUIApi } from '@ui-schema/ui-schema/UIApi'
import { storeUpdater } from '@ui-schema/ui-schema/storeUpdater'
import { Table } from '@ui-schema/ds-material/Widgets/Table'
import { NumberRendererCell, StringRendererCell, TextRendererCell } from '@ui-schema/ds-material/Widgets/TextFieldCell'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets/TableAdvanced/TableAdvanced'
import { List, OrderedMap } from 'immutable'
import { PluginStack } from '@ui-schema/ui-schema/PluginStack'
import { applyPluginStack } from '@ui-schema/ui-schema/applyPluginStack'
import { StringRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { ObjectGroup } from '@ui-schema/ui-schema/ObjectGroup'
import { memo } from '@ui-schema/ui-schema/Utils/memo'
import { useProgress, PROGRESS_DONE, PROGRESS_ERROR, PROGRESS_START } from '@ui-schema/ui-schema/UIApi'

type CustomWidgetsBinding = WidgetsBindingFactory<{}, MuiWidgetsBindingTypes<{}>, MuiWidgetsBindingCustom<{}>>
const customWidgets: CustomWidgetsBinding = {...widgets} as CustomWidgetsBinding
const pluginStack = [...customWidgets.pluginStack]
// the referencing network handler should be at first position
// must be before the `ReferencingHandler`, thus if the root schema for the level is a network schema,
// the network handler can download it, and the normal referencing handler may handle references inside of e.g. `if`
// maybe the network handlers adds a generic prop `resolveNetworkRef`, to request network schema inside e.g. an `if` from inside the ReferencingHandler
//pluginStack.splice(0, 0, ReferencingNetworkHandler)
customWidgets.pluginStack = pluginStack

const CustomTable: React.ComponentType<WidgetProps<MuiWidgetBinding>> = ({widgets, ...props}) => {
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

    return <React.Fragment>
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <Typography component={'p'} variant={'body1'}>
                    One root schema, but rendering the widgets fully manually in the root level.
                </Typography>
                <FreeFormEditor/>
            </Paper>
        </Grid>
    </React.Fragment>
}

const freeFormSchema = createOrderedMap({
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        country: {
            type: 'string',
        },
        file: {
            type: 'object',
            properties: {
                link: {
                    type: 'string',
                },
                expiry: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                },
            },
        },
        city: {
            type: 'string',
            widget: 'Select',
            enum: ['Berlin', 'Paris', 'Zurich'],
        },
    },
})

const storeKeys = List()

const WidgetTextField = applyPluginStack(StringRenderer)

const FileUpload: React.ComponentType<WidgetProps & WithValue> = ({storeKeys, onChange, schema, required, value}) => {
    return <div>
        <input type={'file'} onChange={e => {
            const formData = new FormData()
            // @ts-ignore
            formData.append('file', e.target.files[0])
            // todo: handle `is uploading`
            fetch('https://file.io', {method: 'POST', body: formData})
                .then(r => r.json())
                .then(data => {
                    if (data.status === 200) {
                        console.log('file uploaded!', data)
                        onChange({
                            type: 'set',
                            scopes: ['value'],
                            storeKeys: storeKeys,
                            data: {
                                value: OrderedMap({
                                    link: data.link,
                                    expires: data.expires,
                                    name: data.name,
                                }),
                            },
                            schema,
                            required,
                        })
                    } else {
                        // todo: implement validity handling on error
                        console.error('File upload error!', data)
                    }
                })
        }}/>

        {value?.get('link') ? <div>
            <p>Uploaded File:</p>
            <pre><code>{JSON.stringify(value?.toJS(), undefined, 4)}</code></pre>
        </div> : 'no-file-uploaded'}
    </div>
}

const WidgetFileUpload = applyPluginStack(extractValue(FileUpload))

const CountrySelect: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithScalarValue> = ({schema, ...props}) => {
    const [countries, setCountries] = React.useState<List<string>>(List())
    const [loading, setLoading] = useProgress()

    React.useEffect(() => {
        setLoading(PROGRESS_START)
        fetch('https://restcountries.com/v3.1/subregion/europe', {method: 'GET'})
            .then(r => r.json())
            .then(data => {
                setCountries(List(data.map((d: { name: { common: string } }) => d.name.common)))
                setLoading(PROGRESS_DONE)
            })
            .catch(() => {
                setLoading(PROGRESS_ERROR)
            })
    }, [setCountries, setLoading])

    if (loading === PROGRESS_START) {
        return <LinearProgress/>
    }

    return <Select
        {...props}
        schema={schema.set('enum', countries)}
    />
}

const WidgetCountrySelect = applyPluginStack(CountrySelect)

const FreeFormEditor = () => {
    const showValidity = true
    const [store, setStore] = React.useState(() => createStore(OrderedMap()))

    const onChange: onChangeHandler = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    const {handleStuff} = useUIMeta<UIMetaCustomContext, CustomWidgetsBinding>()
    console.log('handleStuff', store.toJS(), handleStuff)

    return <React.Fragment>
        <UIStoreProvider
            store={store}
            onChange={onChange}
            showValidity={showValidity}
        >
            <FreeFormEditorContent
                storeKeys={storeKeys}
                freeFormSchema={freeFormSchema}
                showValidity={showValidity}
            />
        </UIStoreProvider>
    </React.Fragment>
}

// @ts-ignore
let FreeFormEditorContent = ({storeKeys, freeFormSchema, showValidity}) => {
    const [schema, setSchema] = React.useState<StoreSchemaType>(() => freeFormSchema)
    return <ObjectGroup
        storeKeys={storeKeys}
        schema={freeFormSchema} parentSchema={undefined}
        onSchema={setSchema}
    >
        <Grid container dir={'columns'} spacing={4}>
            <WidgetFileUpload
                level={1}
                storeKeys={storeKeys.push('file') as StoreKeys}
                schema={schema.getIn(['properties', 'file']) as unknown as StoreSchemaType}
                parentSchema={schema}
            />

            <WidgetCountrySelect
                level={1}
                storeKeys={storeKeys.push('country') as StoreKeys}
                schema={schema.getIn(['properties', 'country']) as unknown as StoreSchemaType}
                parentSchema={schema}
            />

            <WidgetTextField
                level={1}
                storeKeys={storeKeys.push('name') as StoreKeys}
                schema={schema.getIn(['properties', 'name']) as unknown as StoreSchemaType}
                parentSchema={schema}

                // using `applyPluginStack`, this free-form widget is fully typed
                // with the actual props of the widget component
                multiline={false}
            />

            <PluginStack<{ readOnly: boolean }>
                showValidity={showValidity}
                storeKeys={storeKeys.push('city') as StoreKeys}
                schema={schema.getIn(['properties', 'name']) as unknown as StoreSchemaType}
                parentSchema={schema}
                level={1}
                readOnly={false}
                // noGrid={false} (as grid-item is included in `PluginStack`)
            />
        </Grid>
    </ObjectGroup>
}
// @ts-ignore
FreeFormEditorContent = memo(FreeFormEditorContent)

/*
// export const TestFn=<D extends {}>(data: D): D
export type TestFn<D extends { [k: string]: any } = {}> = (data: D) => D

export type TestFns<D> = TestFn<D>[]

const fns: TestFns<{ [k: string]: any }> = [
    //(d: { ddd: string }) => ({...d, eee: ''}),
    (d: D) => ({...d, eee: ''}),
    (e: { eee: string } & { ddd: string }) => e,
    (f) => {
        console.log(f)
        return f
    },
]
let data = fns.reduce((c, b) => ({...b(c)}), {ddd: ''})
//data.

const execute = <T extends {} = {}>(arr: ((d: T) => T)[]): T => {
    const data: T = {}
    return arr.reduce((c, b) => ({...b(c)}), data)
}

const d = execute(fns)
d.ddd
*/

export interface UIMetaCustomContext {
    handleStuff: () => 'stuff'
}

// eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
export default () => <AppTheme>
    <div>
        <UIMetaProvider<UIMetaCustomContext, CustomWidgetsBinding> widgets={customWidgets} t={browserT} handleStuff={() => 'stuff'}>
            <UIApiProvider loadSchema={loadSchema} noCache>
                <Dashboard main={Main}/>
            </UIApiProvider>
        </UIMetaProvider>
    </div>
</AppTheme>

/* eslint-disable @typescript-eslint/no-deprecated */
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { MuiBinding } from '@ui-schema/ds-material/BindingType'
import { SchemaGridHandler } from '@ui-schema/ds-material/Grid'
import { GroupRenderer } from '@ui-schema/ds-material/GroupRenderer'
import { bindingComponents } from '@ui-schema/ds-material/Binding/Components'
import { widgetsDefault } from '@ui-schema/ds-material/Binding/WidgetsDefault'
import { widgetsExtended } from '@ui-schema/ds-material/Binding/WidgetsExtended'
import { requiredValidatorLegacy } from '@ui-schema/json-schema/Validators/RequiredValidatorLegacy'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import { emailValidator } from '@ui-schema/json-schema/Validators/EmailValidator'
import { DefaultHandler } from '@ui-schema/react/DefaultHandler'
import { requiredPlugin } from '@ui-schema/json-schema/RequiredPlugin'
import { validatorPlugin } from '@ui-schema/json-schema/ValidatorPlugin'
import { schemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter'
import { injectWidgetEngine } from '@ui-schema/react/applyWidgetEngine'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { keysToName } from '@ui-schema/ui-schema/Utils/keysToName'
import { matchWidget } from '@ui-schema/ui-schema/matchWidget'
import { Map } from 'immutable'
import React, { useCallback } from 'react'
import { useToggle } from '../component/useToggle'
import { dataDemoMain, schemaDemoMain, schemaUser } from '../schemas/demoMain'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { ValidityReporter } from '@ui-schema/react/ValidityReporter'
import { isInvalid } from '@ui-schema/react/isInvalid'
import { createStore, createEmptyStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { browserT } from '../t'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets/TableAdvanced'
import { InfoRenderer } from '@ui-schema/ds-material/Component/InfoRenderer'
import { SelectChipsBase as SelectChips } from '@ui-schema/ds-material/Widgets/SelectChips'

const customBinding: MuiBinding = {
    ...bindingComponents,
    InfoRenderer: InfoRenderer,
    widgetPlugins: [
        // ReferencingHandler,// must be before AND maybe after combining/conditional?
        // ExtractStorePlugin,
        DefaultHandler, // default must be before anything that handles conditionals
        // CombiningHandler,
        // DependentHandler,
        // ConditionalHandler,
        schemaPluginsAdapterBuilder([
            validatorPlugin,
            // requiredValidator,// must be after validator; todo: remove the compat. plugin
            requiredPlugin,
        ]),
        // todo: Grid must be after e.g. ConditionalHandler, yet if referencing/combining results in loading, yet should also be used there
        //       (old) but why was it this high? wasn't that because of e.g. conditional object grids
        SchemaGridHandler,
        // ({Next, ...props}) => {
        //     // just a debug widget, for inspecting extractions
        //     const {errors, storeKeys} = props
        //     console.log('errors', errors)
        //     const {store} = useUIStore()
        //     console.log('store', storeKeys.toJS(), store?.extractValidity(storeKeys)?.toJS())
        //     return <Next.Component {...props}/>
        // },
        function TouchedFocusHandler(props) {
            const focusValueInitial = React.useRef<string | number | null>(null)
            const {Next, value, onChange, storeKeys} = props
            const onFocus = useCallback(() => {
                focusValueInitial.current =
                    typeof value === 'string'
                    || typeof value === 'number' ? value : null
            }, [value])
            const onBlur = useCallback(() => {
                // check if value has changed, only then consider touched
                if ((typeof value === 'string' || typeof value === 'number') && focusValueInitial.current !== value) {
                    onChange({
                        storeKeys,
                        scopes: ['internal'],
                        type: 'update',
                        updater: ({internal = Map()}) => {
                            return {
                                internal: internal.set('touched', true),
                            }
                        },
                    })
                }
                focusValueInitial.current = null
            }, [onChange, storeKeys, value])
            return <Next.Component
                {...props}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        },
        ValidityReporter,
    ],
    widgets: {
        ...widgetsDefault,
        ...widgetsExtended,
        SelectChips: SelectChips,
        TableAdvanced: TableAdvanced,
    },
    matchWidget: matchWidget,//<NonNullable<NonNullable<MuiBinding['widgets']>['types']>, NonNullable<NonNullable<MuiBinding['widgets']>['custom']>>,

    GroupRenderer: GroupRenderer,
}
//widgets.types.null = () => 'null'

const GridStack = injectWidgetEngine(GridContainer)

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false)
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(dataDemoMain)))
    const [schema, setSchema] = React.useState(() => createOrderedMap(schemaDemoMain))

    const onChange = React.useCallback((actions) => {
        setStore(prevStore => {
            const newStore = storeUpdater(actions)(prevStore)
            /*const newValue = newStore.getIn(prependKey(storeKeys, 'values'))
            const prevValue = prevStore.getIn(prependKey(storeKeys, 'values'))
            console.log(
                isImmutable(newValue) ? newValue.toJS() : newValue,
                isImmutable(prevValue) ? prevValue.toJS() : prevValue,
                storeKeys.toJS(),
                deleteOnEmpty, type,
            )*/
            return newStore
        })
    }, [setStore])

    const invalid = isInvalid(store.getValidity())
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
                <GridContainer>
                    <WidgetEngine isRoot schema={schema}/>
                </GridContainer>
                {/*<GridStack isRoot schema={schema}/>*/}
                <MuiSchemaDebug setSchema={setSchema} schema={schema}/>

                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Button
                        onClick={() => setShowValidity(!showValidity)} sx={{flexGrow: 1}}
                    >
                        {`${showValidity ? 'hide' : 'show'} validity`}
                    </Button>
                    <Typography
                        fontWeight={'bold'}
                        variant={'caption'}
                        sx={{
                            backgroundColor: `${invalid ? 'error' : 'success'}.main`,
                            color: `${invalid ? 'error' : 'success'}.contrastText`,
                            borderRadius: 3,
                            px: 1,
                            py: 0.5,
                            mr: 'auto',
                        }}
                    >
                        {invalid ? 'invalid' : 'valid'}
                    </Typography>
                </Box>

            </Paper>

            <MuiSchemaDebug setSchema={setSchema} schema={schema}/>

        </UIStoreProvider>
    </React.Fragment>
}

const DemoUser: React.FC<{}> = () => {
    const [store, setStore] = React.useState(() => createEmptyStore())

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return <Grid container spacing={3} sx={{justifyContent: 'center'}}>
        <Grid item xs={12} md={8}>
            <UIStoreProvider
                store={store}
                onChange={onChange}
                showValidity
            >
                <GridStack isRoot schema={schemaUser}/>
                <MuiSchemaDebug schema={schemaUser}/>
            </UIStoreProvider>
        </Grid>
    </Grid>
}

const Main = () => {
    const [toggle, getToggle] = useToggle()

    return <Grid container spacing={3}>
        <Grid item xs={12}>
            <MainStore/>
        </Grid>
        <Grid item xs={12}>
            <Button style={{marginBottom: 12}} onClick={() => toggle('demoUser')} variant={getToggle('demoUser') ? 'contained' : 'outlined'}>
                demo User
            </Button>
            {getToggle('demoUser') ?
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        overflow: 'auto',
                        flexDirection: 'column',
                    }}
                >
                    <DemoUser/>
                </Paper> : null}
        </Grid>
    </Grid>
}

const validate = Validator([
    ...standardValidators,
    emailValidator,
    requiredValidatorLegacy,
]).validate

export default function MaterialDemo() {
    return <>
        <UIMetaProvider
            binding={customBinding}
            t={browserT}
            validate={validate}
            keysToName={keysToName}
        >
            <Main/>
        </UIMetaProvider>
    </>
}

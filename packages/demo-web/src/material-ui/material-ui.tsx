import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { MuiWidgetsBinding } from '@ui-schema/ds-material'
import { bindingExtended } from '@ui-schema/ds-material/BindingExtended'
import { SchemaGridHandler } from '@ui-schema/ds-material/Grid'
import { baseComponents, typeWidgets } from '@ui-schema/ds-material/BindingDefault'
import { requiredValidatorLegacy } from '@ui-schema/json-schema/Validators/RequiredValidatorLegacy'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import { DefaultHandler } from '@ui-schema/react-json-schema/DefaultHandler'
import { requiredPlugin } from '@ui-schema/json-schema/RequiredPlugin'
import { validatorPlugin } from '@ui-schema/json-schema/ValidatorPlugin'
import { schemaPluginsAdapterBuilder } from '@ui-schema/react-json-schema/SchemaPluginsAdapter'
import { injectWidgetEngine } from '@ui-schema/react/applyWidgetEngine'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { widgetMatcher } from '@ui-schema/ui-schema/widgetMatcher'
import React from 'react'
import { useToggle } from '../component/useToggle'
import { dataDemoMain, schemaDemoMain, schemaUser } from '../schemas/demoMain'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { createOrderedMap, createMap } from '@ui-schema/ui-schema/createMap'
import { isInvalid, ValidityReporter } from '@ui-schema/react/ValidityReporter'
import { createStore, createEmptyStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { browserT } from '../t'
import { UIApiProvider } from '@ui-schema/react/UIApi'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets/TableAdvanced'
import { InfoRenderer } from '@ui-schema/ds-material/Component/InfoRenderer'
import { SelectChipsBase as SelectChips } from '@ui-schema/ds-material/Widgets/SelectChips'

const customBinding: MuiWidgetsBinding = {
    ...baseComponents,
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
        ValidityReporter,
        WidgetRenderer,
    ],
    widgets: {
        types: typeWidgets,
        custom: {
            ...bindingExtended,
            SelectChips: SelectChips,
            TableAdvanced: TableAdvanced,
        },
    },
    matchWidget: widgetMatcher,//<NonNullable<NonNullable<MuiWidgetsBinding['widgets']>['types']>, NonNullable<NonNullable<MuiWidgetsBinding['widgets']>['custom']>>,
}
//widgets.types.null = () => 'null'

const GridStack = injectWidgetEngine(GridContainer)

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false)
    const [store, setStore] = React.useState(() => createStore(createMap(dataDemoMain)))
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

const loadSchema = (url, versions) => {
    console.log('Demo loadSchema (url, optional versions)', url, versions)
    return fetch(url).then(r => r.json())
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
    requiredValidatorLegacy,
]).validate

export default function MaterialDemo() {
    return <>
        <UIMetaProvider
            binding={customBinding}
            t={browserT}
            validate={validate}
        >
            <UIApiProvider loadSchema={loadSchema} noCache>
                <Main/>
            </UIApiProvider>
        </UIMetaProvider>
    </>
}

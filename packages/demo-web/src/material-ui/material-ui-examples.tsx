import { SchemaGridHandler } from '@ui-schema/ds-material/Grid'
import { define, widgetsCustom, widgetsTypes } from '@ui-schema/ds-material/WidgetsDefault'
import { requiredValidatorLegacy } from '@ui-schema/json-schema/Validators/RequiredValidatorLegacy'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import { DefaultHandler } from '@ui-schema/react-json-schema/DefaultHandler'
import { /*CombiningHandler, ConditionalHandler,*/ DependentHandler } from '@ui-schema/react-json-schema'
import { requiredPlugin } from '@ui-schema/react-json-schema/RequiredPlugin'
import { ResourceBranchHandler } from '@ui-schema/react-json-schema/ResourceBranchHandler'
import { validatorPlugin } from '@ui-schema/react-json-schema/ValidatorPlugin'
import { SchemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter'
import { ValidityReporter } from '@ui-schema/react/ValidityReporter'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import React from 'react'
import { useToggle } from '../component/useToggle'
import { schemaWCombining } from '../schemas/demoCombining'
import { schemaWConditional, schemaWConditional1, schemaWConditional2 } from '../schemas/demoConditional'
import { schemaWDep1, schemaWDep2 } from '../schemas/demoDependencies'
import { schemaDemoReferencing, schemaDemoReferencingNetwork, schemaDemoReferencingNetworkB } from '../schemas/demoReferencing'
import { schemaSimString, schemaSimBoolean, schemaSimCheck, schemaSimNumber, schemaSimRadio, schemaSimSelect, schemaNull, schemaSimInteger } from '../schemas/demoSimples'
import { schemaGrid } from '../schemas/demoGrid'
import Grid from '@mui/material/Grid'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { browserT } from '../t'
import { schemaLists } from '../schemas/demoLists'
import { schemaNumberSlider } from '../schemas/demoNumberSlider'
import { DummyRenderer } from './component/MuiMainDummy'
import { UIApiProvider } from '@ui-schema/react/UIApi'
import { schemaDemoTable, schemaDemoTableAdvanced, schemaDemoTableMap, schemaDemoTableMapBig } from '../schemas/demoTable'
import { Table } from '@ui-schema/ds-material/Widgets/Table'
import { NumberRendererCell, StringRendererCell, TextRendererCell } from '@ui-schema/ds-material/Widgets/TextFieldCell'
import { TableAdvanced } from '@ui-schema/ds-material/Widgets/TableAdvanced'
import { InfoRenderer, InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'
import { SelectChips } from '@ui-schema/ds-material/Widgets/SelectChips'
import { WidgetProps } from '@ui-schema/react/Widgets'

const CustomTableBase: React.ComponentType<WidgetProps> = ({widgets, ...props}) => {
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
const CustomTable = React.memo(CustomTableBase)

// use current data to build applicable schemas
// make default
// run validations on defaulted dats
// build/merge into happy path

const customWidgets = define<{ InfoRenderer?: React.ComponentType<InfoRendererProps> }, {}>({
    InfoRenderer: InfoRenderer,

    widgetPlugins: [
        //ReferencingHandler,// must be before AND maybe after combining/conditional?
        ResourceBranchHandler, // << move into plugins adapter? only dynamicRef wouldn't work that way
        // ExtractStorePlugin,
        DefaultHandler, // default must be before anything that handles conditionals; but also after conditionals if default depends on it
        //CombiningHandler, // < pure schema, but changing applicable schema
        DependentHandler, // < pure schema, but changing applicable schema
        //ConditionalHandler, // < pure schema, but changing applicable schema
        // todo: Grid must be after e.g. ConditionalHandler, yet if referencing/combining results in loading, yet should also be used there
        //       - hidden/isVirtual before $ref atm., needs to be before grid handler but after combining etc
        //       (old) but why was it this high? wasn't that because of e.g. conditional object grids
        SchemaGridHandler,
        SchemaPluginsAdapterBuilder([
            validatorPlugin,
            // requiredValidator,// must be after validator; todo: remove the compat. plugin
            requiredPlugin,
        ]),
        ValidityReporter,
        WidgetRenderer,
    ],
    types: widgetsTypes(),
    custom: {
        ...widgetsCustom(),
        SelectChips: SelectChips,
        Table: CustomTable,
        TableAdvanced: TableAdvanced,
    },
})
//widgets.types.null = () => 'null'

const loadSchema = (url, versions) => {
    console.log('Demo loadSchema (url, optional versions)', url, versions)
    return fetch(url).then(r => r.json())
}

const Main = () => {
    const [toggle, getToggle] = useToggle()

    return <Grid container spacing={3}>
        <Grid item xs={12}>
            <DummyRenderer
                id={'schemaTableMap'} schema={schemaDemoTableMap}
                toggleDummy={toggle} getDummy={getToggle}
            />
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer
                id={'schemaTable'} schema={schemaDemoTable}
                toggleDummy={toggle} getDummy={getToggle}
            />
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer
                id={'schemaDemoTableMapBig'} schema={schemaDemoTableMapBig}
                toggleDummy={toggle} getDummy={getToggle}
            />
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer
                id={'schemaDemoTableAdvanced'} schema={schemaDemoTableAdvanced}
                toggleDummy={toggle} getDummy={getToggle}
            />
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
            <DummyRenderer id={'schemaLists'} schema={schemaLists} toggleDummy={toggle} getDummy={getToggle}/>
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
    </Grid>
}

const validate = Validator([
    ...standardValidators,
    requiredValidatorLegacy,
]).validate

export default function MaterialDemo() {
    return <>
        <UIMetaProvider
            widgets={customWidgets}
            t={browserT}
            validate={validate}
        >
            <UIApiProvider loadSchema={loadSchema} noCache>
                <Main/>
            </UIApiProvider>
        </UIMetaProvider>
    </>
}

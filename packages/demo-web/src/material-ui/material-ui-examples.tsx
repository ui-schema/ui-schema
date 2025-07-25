/* eslint-disable @typescript-eslint/no-deprecated */
import { MuiBinding } from '@ui-schema/ds-material/Binding'
import { bindingExtended } from '@ui-schema/ds-material/BindingExtended'
import { SchemaGridHandler } from '@ui-schema/ds-material/Grid'
import { baseComponents, typeWidgets } from '@ui-schema/ds-material/BindingDefault'
import { requiredValidatorLegacy } from '@ui-schema/json-schema/Validators/RequiredValidatorLegacy'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import { DefaultHandler } from '@ui-schema/react/DefaultHandler'
import { requiredPlugin } from '@ui-schema/json-schema/RequiredPlugin'
import { validatorPlugin } from '@ui-schema/json-schema/ValidatorPlugin'
import { schemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter'
import { ValidityReporter } from '@ui-schema/react/ValidityReporter'
import { keysToName } from '@ui-schema/ui-schema/Utils/keysToName'
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
import { TableAdvancedBase as TableAdvanced } from '@ui-schema/ds-material/Widgets/TableAdvanced'
import { InfoRenderer } from '@ui-schema/ds-material/Component/InfoRenderer'
import { SelectChipsBase as SelectChips } from '@ui-schema/ds-material/Widgets/SelectChips'
import { WidgetProps } from '@ui-schema/react/Widget'

const CustomTableBase: React.ComponentType<WidgetProps> = ({binding, ...props}) => {
    const customWidgets = React.useMemo(() => ({
        ...binding,
        widgets: {
            ...binding?.widgets,
            string: StringRendererCell,
            number: NumberRendererCell,
            integer: NumberRendererCell,
            Text: TextRendererCell,
        },
    }), [binding])

    return <Table
        {...props}
        binding={customWidgets}
    />
}
// const CustomTable = React.memo(CustomTableBase)

// use current data to build applicable schemas
// make default
// run validations on defaulted dats
// build/merge into happy path

const customWidgets: MuiBinding = {
    ...baseComponents,
    InfoRenderer: InfoRenderer,

    widgetPlugins: [
        //ReferencingHandler,// must be before AND maybe after combining/conditional?
        // ExtractStorePlugin,
        DefaultHandler, // default must be before anything that handles conditionals; but also after conditionals if default depends on it
        //CombiningHandler, // < pure schema, but changing applicable schema
        //DependentHandler, // < pure schema, but changing applicable schema
        //ConditionalHandler, // < pure schema, but changing applicable schema
        schemaPluginsAdapterBuilder([
            validatorPlugin,
            // requiredValidator,// must be after validator; todo: remove the compat. plugin
            requiredPlugin,
        ]),
        // todo: Grid must be after e.g. ConditionalHandler, yet if referencing/combining results in loading, yet should also be used there
        //       - hidden/isVirtual before $ref atm., needs to be before grid handler but after combining etc
        //       (old) but why was it this high? wasn't that because of e.g. conditional object grids
        SchemaGridHandler,
        ValidityReporter,
    ],
    widgets: {
        ...typeWidgets,
        ...bindingExtended,
        array: bindingExtended.GenericList,
        SelectChips: SelectChips,
        Table: CustomTableBase,
        TableAdvanced: TableAdvanced,
    },
}
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
            binding={customWidgets}
            t={browserT}
            validate={validate}
            keysToName={keysToName}
        >
            <UIApiProvider loadSchema={loadSchema} noCache>
                <Main/>
            </UIApiProvider>
        </UIMetaProvider>
    </>
}

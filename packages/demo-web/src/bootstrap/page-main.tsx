import { SchemaGridHandler } from '@ui-schema/ds-bootstrap/Grid'
import { requiredPlugin } from '@ui-schema/json-schema/RequiredPlugin'
import { validatorPlugin } from '@ui-schema/json-schema/ValidatorPlugin'
import { DefaultHandler } from '@ui-schema/react/DefaultHandler'
import { schemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import { keysToName } from '@ui-schema/ui-schema/Utils/keysToName'
import React from 'react'
import { Dashboard } from './Dashboard'
import { schemaTestBts, dataDemoMain } from '../schemas/demoBts'
import { schemaGrid } from '../schemas/demoGrid'
import { widgets } from '@ui-schema/ds-bootstrap/BindingDefault'
import { GridContainer } from '@ui-schema/ds-bootstrap/GridContainer'
import { browserT } from '../t'
import { BtsSchemaDebug } from '../component/BtsSchemaDebug'
import clsx from 'clsx'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { createStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { isInvalid } from '@ui-schema/react/isInvalid'

const customBinding: typeof widgets = {
    ...widgets,
    widgetPlugins: [
        // // eslint-disable-next-line @typescript-eslint/no-deprecated
        // ReferencingHandler,
        // SchemaGridHandler,
        // // ExtractStorePlugin,
        // // eslint-disable-next-line @typescript-eslint/no-deprecated
        // CombiningHandler,
        // DefaultHandler,
        // // eslint-disable-next-line @typescript-eslint/no-deprecated
        // DependentHandler,
        // // eslint-disable-next-line @typescript-eslint/no-deprecated
        // ConditionalHandler,
        // ValidityReporter,
        DefaultHandler,
        schemaPluginsAdapterBuilder([
            validatorPlugin,
            requiredPlugin,
        ]),
        SchemaGridHandler,
    ],
}

const validate = Validator(standardValidators).validate

const DemoGrid = () => {
    const [store, setStore] = React.useState(() => createStore(createOrderedMap({})))

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return <UIMetaProvider
        binding={customBinding}
        t={browserT}
        validate={validate}
        keysToName={keysToName}
    >
        <UIStoreProvider
            store={store}
            onChange={onChange}
            showValidity
        >
            <GridContainer>
                <WidgetEngine isRoot schema={schemaGrid(12)}/>
            </GridContainer>
            <BtsSchemaDebug/>
        </UIStoreProvider>
    </UIMetaProvider>
}

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false)
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(dataDemoMain)))
    const [schema, setSchema] = React.useState(schemaTestBts)

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return <React.Fragment>
        <UIMetaProvider
            binding={customBinding}
            t={browserT}
            validate={validate}
            keysToName={keysToName}
        >
            <UIStoreProvider
                store={store}
                onChange={onChange}
                showValidity={showValidity}
            >
                <GridContainer>
                    <WidgetEngine isRoot schema={schema}/>
                </GridContainer>
                <BtsSchemaDebug setSchema={setSchema} schema={schema}/>
            </UIStoreProvider>
        </UIMetaProvider>

        <button className={clsx('btn', 'btn-primary', 'col-12', 'text-uppercase')} onClick={() => setShowValidity(!showValidity)}>validity</button>
        {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}

    </React.Fragment>
}

// eslint-disable-next-line react/display-name
export default () => {
    return <Dashboard>
        <div>
            <MainStore/>
            <DemoGrid/>
        </div>
    </Dashboard>
}

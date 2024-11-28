import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import React from 'react'
import { Dashboard } from './Dashboard'
import { schemaTestBts, dataDemoMain } from '../schemas/demoBts'
import { schemaGrid } from '../schemas/demoGrid'
import { GridContainer, widgets } from '@ui-schema/ds-bootstrap'
import { browserT } from '../t'
import { BtsSchemaDebug } from '../component/BtsSchemaDebug'
import clsx from 'clsx'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { injectWidgetEngine } from '@ui-schema/react/applyWidgetEngine'
import { createStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { isInvalid } from '@ui-schema/react/ValidityReporter'

const GridStack = injectWidgetEngine(GridContainer)
const DemoGrid = () => {
    const [store, setStore] = React.useState(() => createStore(createOrderedMap({})))

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return <UIMetaProvider
        widgets={widgets}
        t={browserT}
        validate={Validator(standardValidators).validate}
    >
        <UIStoreProvider
            store={store}
            onChange={onChange}
            showValidity
        >
            <GridStack isRoot schema={schemaGrid(12)}/>
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
            widgets={widgets}
            t={browserT}
            validate={Validator(standardValidators).validate}
        >
            <UIStoreProvider
                store={store}
                onChange={onChange}
                showValidity={showValidity}
            >
                <GridStack isRoot schema={schema}/>
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

import React from 'react';
import {Dashboard} from './Dashboard';
import {schemaTestBts, dataDemoMain} from '../schemas/demoBts';
import {schemaGrid} from '../schemas/demoGrid';
import {GridContainer, widgets} from '@ui-schema/ds-bootstrap';
import {
    UIMetaProvider, UIStoreProvider,
    createOrderedMap, createStore,
    injectPluginStack,
    isInvalid,
} from '@ui-schema/ui-schema';
import {browserT} from '../t';
import {BtsSchemaDebug} from '../component/BtsSchemaDebug';
import clsx from 'clsx';
import {storeUpdater} from '@ui-schema/ui-schema/storeUpdater';

const GridStack = injectPluginStack(GridContainer)
const DemoGrid = () => {
    const [store, setStore] = React.useState(() => createStore(createOrderedMap({})));

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return <UIMetaProvider widgets={widgets} t={browserT}>
        <UIStoreProvider
            store={store}
            onChange={onChange}
            showValidity
        >
            <GridStack isRoot schema={schemaGrid(12)}/>
            <BtsSchemaDebug/>
        </UIStoreProvider>
    </UIMetaProvider>
};

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(dataDemoMain)));
    const [schema, setSchema] = React.useState(schemaTestBts);

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return <React.Fragment>
        <UIMetaProvider widgets={widgets} t={browserT}>
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
};

export default () => {
    return <Dashboard>
        <div>
            <MainStore/>
            <DemoGrid/>
        </div>
    </Dashboard>
};

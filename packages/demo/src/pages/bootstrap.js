import React from 'react';
import {BootstrapDashboard} from '../ds/bootstrap/layout/Main';
import {schemaTestBts, dataDemoMain} from "../schemas/demoBts";
import {schemaGrid} from "../schemas/demoGrid";
import {widgets,} from "@ui-schema/ds-bootstrap";
import {SchemaEditor, isInvalid, createOrderedMap, createStore} from "@ui-schema/ui-schema";
import {browserT} from "../t";
import {BtsSchemaDebug} from "../component/BtsSchemaDebug";
import clsx from "clsx";

const DemoGrid = () => {
    const [store, setStore] = React.useState(() => createStore(createOrderedMap({})));

    return <SchemaEditor
        schema={schemaGrid(12)}
        store={store}
        onChange={setStore}
        widgets={widgets}
        t={browserT}
    >
        <BtsSchemaDebug/>
    </SchemaEditor>
};

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(dataDemoMain)));
    const [schema, setSchema] = React.useState(schemaTestBts);

    return <React.Fragment>
        <SchemaEditor
            schema={schema}
            store={store}
            onChange={setStore}
            widgets={widgets}
            showValidity={showValidity}
            t={browserT}
        >
            <BtsSchemaDebug setSchema={setSchema}/>
        </SchemaEditor>

        <button className={clsx("btn", "btn-primary", "col-12", "text-uppercase")} onClick={() => setShowValidity(!showValidity)}>validity</button>
        {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}

    </React.Fragment>
};

const Main = () => <React.Fragment>
    <div>
        <MainStore/>
        <DemoGrid/>
    </div>
</React.Fragment>;

const Bootstrap = () => {
    return <BootstrapDashboard>
        <Main main={Main}/>
    </BootstrapDashboard>
};

export {Bootstrap}

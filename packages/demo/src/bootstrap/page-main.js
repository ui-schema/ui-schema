import React from 'react';
import {Dashboard} from './Dashboard';
import {schemaTestBts, dataDemoMain} from "../schemas/demoBts";
import {schemaGrid} from "../schemas/demoGrid";
import {widgets,} from "@ui-schema/ds-bootstrap";
import {UIGenerator, isInvalid, createOrderedMap, createStore} from "@ui-schema/ui-schema";
import {browserT} from "../t";
import {BtsSchemaDebug} from "../component/BtsSchemaDebug";
import clsx from "clsx";

const DemoGrid = () => {
    const [store, setStore] = React.useState(() => createStore(createOrderedMap({})));

    return <UIGenerator
        schema={schemaGrid(12)}
        store={store}
        onChange={setStore}
        widgets={widgets}
        t={browserT}
    >
        <BtsSchemaDebug/>
    </UIGenerator>
};

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(dataDemoMain)));
    const [schema, setSchema] = React.useState(schemaTestBts);

    return <React.Fragment>
        <UIGenerator
            schema={schema}
            store={store}
            onChange={setStore}
            widgets={widgets}
            showValidity={showValidity}
            t={browserT}
        >
            <BtsSchemaDebug setSchema={setSchema}/>
        </UIGenerator>

        <button className={clsx("btn", "btn-primary", "col-12", "text-uppercase")} onClick={() => setShowValidity(!showValidity)}>validity</button>
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

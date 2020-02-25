import React from 'react';
import {BootstrapDashboard} from '../ds/bootstrap/layout/Main';
import {schemaUser, dataDemoMain} from "../schemas/demoMain";
import {schemaGrid} from "../schemas/demoGrid";
import {widgets,} from "@ui-schema/ds-bootstrap";
import {SchemaEditor, isInvalid, createOrderedMap, createMap, createStore} from "@ui-schema/ui-schema";
import {browserT} from "../t";
import {BtsSchemaDebug} from "../component/BtsSchemaDebug";
import clsx from "clsx";

const DemoGrid = () => {
    const [data, setData] = React.useState(() => createStore(createOrderedMap({})));

    return <SchemaEditor
        schema={schemaGrid}
        store={data}
        onChange={setData}
        widgets={widgets}
        t={browserT}
    >
        <BtsSchemaDebug/>
    </SchemaEditor>
};

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [validity, setValidity] = React.useState(createMap());
    const [data, setData] = React.useState(() => createStore(createOrderedMap(dataDemoMain)));
    const [schema, setSchema] = React.useState(createOrderedMap(schemaUser));

    return <React.Fragment>
        <SchemaEditor
            schema={schema}
            store={data}
            onChange={setData}
            widgets={widgets}
            validity={validity}
            showValidity={showValidity}
            onValidity={setValidity}
            t={browserT}
        >
            <BtsSchemaDebug setSchema={setSchema}/>
        </SchemaEditor>

        <button className={clsx("btn", "btn-primary", "col-12", "text-uppercase")} onClick={() => setShowValidity(!showValidity)}>validity</button>
        {isInvalid(validity) ? 'invalid' : 'valid'}

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

import React from 'react';
import {Link} from 'react-router-dom';
import {BootstrapDashboard} from '../ds/bootstrap/layout/Main';
import {schemaUser, dataDemoMain} from "../schemas/demoMain";
import {schemaGrid} from "../schemas/demoGrid";
import {widgets,} from "@ui-schema/ds-bootstrap";
import {SchemaEditor, isInvalid, createOrderedMap, createMap} from "@ui-schema/ui-schema";
import {SchemaDebug} from "../component/SchemaDebug";
import {browserT} from "../t";



const DemoGrid = () => {
    const [data, setData] = React.useState(createOrderedMap({}));

    return <SchemaEditor
        schema={schemaGrid}
        store={data}
        onChange={setData}
        widgets={widgets}
        t={browserT}
    >
        <SchemaDebug/>
    </SchemaEditor>
};


const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [validity, setValidity] = React.useState(createMap());
    const [data, setData] = React.useState(createOrderedMap(dataDemoMain));
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
            <SchemaDebug setSchema={setSchema}/>
        </SchemaEditor>

        <button onClick={() => setShowValidity(!showValidity)}>validity</button>
        {isInvalid(validity) ? 'invalid' : 'valid'}

        <Link to={'/'}>>to Material</Link>
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

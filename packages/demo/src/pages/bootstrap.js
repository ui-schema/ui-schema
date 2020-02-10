import React from 'react';
import {Link} from 'react-router-dom';
import {BootstrapDashboard} from '../ds/bootstrap/layout/Main';

import {data1, schema1} from "../_schema1";
import {widgets,} from "@ui-schema/ds-bootstrap";
import {SchemaEditor, isInvalid, createOrderedMap, createMap} from "@ui-schema/ui-schema";
import {SchemaDebug} from "../component/SchemaDebug";
import Orders from "../ds/material-ui/dashboard/Orders";

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [validity, setValidity] = React.useState(createMap());
    const [data, setData] = React.useState(createOrderedMap(data1));
    const [schema, setSchema] = React.useState(createOrderedMap(schema1));

    return <React.Fragment>
        <SchemaEditor
            schema={schema}
            store={data}
            onChange={setData}
            widgets={widgets}
            validity={validity}
            showValidity={showValidity}
            onValidity={setValidity}
        >
            <SchemaDebug setSchema={setSchema}/>
        </SchemaEditor>

        <button onClick={() => setShowValidity(!showValidity)}>validity</button>
        {isInvalid(validity) ? 'invalid' : 'valid'}

        <Link to={'/'}>>to Material</Link>
    </React.Fragment>
};

const Main = () => <React.Fragment>
    <div className="container">
        <div className="shadow-sm">
            <MainStore/>
        </div>
    </div>
    <div className="container">
        <div className="shadow-sm">
            <Orders/>
        </div>
    </div>
</React.Fragment>;

const Bootstrap = () => {
    return <BootstrapDashboard>
        <Main main={Main}/>
    </BootstrapDashboard>
};

export {Bootstrap}

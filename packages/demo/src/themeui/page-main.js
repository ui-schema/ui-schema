import React from 'react';
import {NavLink as Link} from 'react-router-dom';
import {schemaGrid} from "../schemas/demoGrid";
import {widgets,} from "@ui-schema/ds-themeui";
import {SchemaEditor, isInvalid, createOrderedMap, createStore} from "@ui-schema/ui-schema";
import {browserT} from "../t";
import {routesThemes} from "../routes";

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [store, setStore] = React.useState(() => createStore(createOrderedMap({})));
    const [schema/*, setSchema*/] = React.useState(schemaGrid(12));

    return <React.Fragment>
        <SchemaEditor
            schema={schema}
            store={store}
            onChange={setStore}
            widgets={widgets}
            showValidity={showValidity}
            t={browserT}
        />

        <button onClick={() => setShowValidity(!showValidity)}>validity</button>
        {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}

    </React.Fragment>
};

export default () => {
    return <div style={{display: 'flex'}}>
        <ul style={{paddingRight: 16, flexShrink: 0}}>
            {routesThemes.map(route => <li key={route[0]}>
                <Link to={route[0]}>{route[1]}</Link>
            </li>)}
        </ul>
        <div style={{flexGrow: 2}}>
            <MainStore/>
        </div>
    </div>
};

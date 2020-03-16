import React from 'react';
import {NavLink as Link} from 'react-router-dom';
import {schemaGrid} from "../schemas/demoGrid";
import {widgets,} from "@ui-schema/ds-blueprint";
import {SchemaEditor, isInvalid, createOrderedMap, createStore} from "@ui-schema/ui-schema";
import {browserT} from "../t";
import styles from "@blueprintjs/core/lib/css/blueprint.css";
import stylesGrid from "flexboxgrid/dist/flexboxgrid.css";
import {routesThemes} from "../routes";

const useStyle = () => {
    React.useEffect(() => {
        styles.use();
        stylesGrid.use();

        return () => {
            styles.unuse()
            stylesGrid.unuse()
        };
    }, []);

    return null;
};


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
    useStyle();

    return <div style={{display: 'flex'}}>
        <ul style={{paddingRight: 16, flexShrink: 0}}>
            {routesThemes.map(route => <li key={route[0]}>
                <Link to={route[0]}>{route[1]}</Link>
            </li>)}
        </ul>
        <div>
            <MainStore/>
        </div>
    </div>
};

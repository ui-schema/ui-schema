import React from 'react';
import clsx from "clsx";
import {useSchemaData} from "../../../ui-schema/src/Schema/EditorStore";
import {ImmutableEditor} from 'react-immutable-editor';


const BtSchemaDebug = () => {
    const {store, schema, onChange} = useSchemaData();

    return <React.Fragment>
        <div className={clsx("shadow-sm", "px-4", "py-4", "my-4", "bg-secondary")} /*style={{backgroundColor: "#002b36"}} */>
            <ImmutableEditor data={store} onChange={(keys, value) => onChange(store.setIn(keys, value))} getVal={keys => store.getIn(keys)}
                             theme={{
                                 base00: "bg-secondary",
                                 base0D: "text-light",
                                 base0B: "text-secondary",
                             }}/>
        </div>
        <div className={clsx("shadow-sm", "px-4", "py-4", "my-4", "bg-secondary")} /*style={{backgroundColor: "#002b36"}} */>
            <ImmutableEditor data={schema} onChange={() => console.log('not implemented')} getVal={keys => schema.getIn(keys)}
                             theme={{
                                 base00: "bg-secondary",
                                 base0D: "text-light",
                                 base0B: "text-secondary",
                             }}/>
        </div>
    </React.Fragment>
};


export {BtSchemaDebug}

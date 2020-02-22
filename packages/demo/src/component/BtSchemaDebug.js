import React from 'react';

import {useSchemaData} from "../../../ui-schema/src/Schema/EditorStore";
import {ImmutableEditor} from 'react-immutable-editor';


const BtSchemaDebug = () => {
    const {store, schema, onChange} = useSchemaData();

    return <React.Fragment>
        <div className={"shadow-sm"} >
            <ImmutableEditor data={store} onChange={(keys, value) => onChange(store.setIn(keys, value))} getVal={keys => store.getIn(keys)}/>
        </div>
        <div className={"shadow-sm"}>
            <ImmutableEditor data={schema} onChange={() => console.log('not implemented')} getVal={keys => schema.getIn(keys)}/>
        </div>
    </React.Fragment>
};


export {BtSchemaDebug}

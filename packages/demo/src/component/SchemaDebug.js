import React from 'react';

import ImmutableEditor from "../component/ImmutableEditor";
import {useSchemaData} from "@ui-schema/ui-schema";

const SchemaDebug = () => {
    const {store, schema, onChange} = useSchemaData();

    return <React.Fragment>
        <ImmutableEditor data={store} onChange={(keys, value) => onChange(store.setIn(keys, value))} getVal={keys => store.getIn(keys)}/>
        <ImmutableEditor data={schema} onChange={() => console.log('not implemented')} getVal={keys => schema.getIn(keys)}/>
    </React.Fragment>
};


export {SchemaDebug}

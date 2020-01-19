import React from 'react';

import ImmutableEditor from "../component/ImmutableEditor";
import {useSchemaEditor} from "@ui-schema/ui-schema/src";

const SchemaDebug = () => {
    const {store, schema, setData, setSchema} = useSchemaEditor();

    return <React.Fragment>
        <ImmutableEditor data={store} onChange={setData} getVal={keys => store.getIn(keys)}/>
        <ImmutableEditor data={schema} onChange={setSchema} getVal={keys => schema.getIn(keys)}/>
    </React.Fragment>
};


export {SchemaDebug}

import {updateValue, useSchemaData} from "@ui-schema/ui-schema";
import React from "react";

const SchemaDebug = ({StyledEditor}) => {
    const {store, schema, onChange} = useSchemaData();

    return <React.Fragment>
        <StyledEditor data={store} onChange={(keys, value) => onChange(updateValue(keys, value))} getVal={keys => store.getIn(keys)}/>
        <StyledEditor data={schema} onChange={() => console.log('not implemented')} getVal={keys => schema.getIn(keys)}/>
    </React.Fragment>
};


export {SchemaDebug}

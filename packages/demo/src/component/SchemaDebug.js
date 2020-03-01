import {updateValue, useSchemaStore} from "@ui-schema/ui-schema";
import React from "react";

const SchemaDebug = ({StyledEditor}) => {
    const {valueStore, schema, onChange} = useSchemaStore();

    return <React.Fragment>
        <StyledEditor data={valueStore} onChange={(keys, value) => onChange(updateValue(keys, value))} getVal={keys => valueStore.getIn(keys)}/>
        <StyledEditor data={schema} onChange={() => console.log('not implemented')} getVal={keys => schema.getIn(keys)}/>
    </React.Fragment>
};


export {SchemaDebug}

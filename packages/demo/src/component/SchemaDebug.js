import {updateValue, useUI} from "@ui-schema/ui-schema";
import React from "react";

const SchemaDebug = ({StyledEditor}) => {
    const {store, schema, onChange} = useUI();

    return <React.Fragment>
        <StyledEditor data={store.getValues()} onChange={(keys, value) => onChange(updateValue(keys, value))} getVal={keys => store.getValues().getIn(keys)}/>
        <StyledEditor data={schema} onChange={() => console.log('not implemented')} getVal={keys => schema.getIn(keys)}/>
    </React.Fragment>
};


export {SchemaDebug}

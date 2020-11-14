import {updateValue, useUI} from '@ui-schema/ui-schema';
import React from 'react';
import {List} from 'immutable';

export const SchemaDebug = ({StyledEditor}) => {
    const {store, schema, onChange} = useUI();

    return <React.Fragment>
        <StyledEditor
            data={store.getValues()}
            onChange={(keys, value) =>
                onChange(updateValue(List(keys), value, false))
            }
            getVal={keys => store.getValues().getIn(keys)}
        />
        <StyledEditor data={schema} onChange={() => console.log('not implemented')} getVal={keys => schema.getIn(keys)}/>
    </React.Fragment>
};

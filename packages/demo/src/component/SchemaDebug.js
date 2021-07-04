import {useUI} from '@ui-schema/ui-schema/UIStore';
import React from 'react';
import {List} from 'immutable';

export const SchemaDebug = ({StyledEditor, schema}) => {
    const {store, onChange} = useUI();

    return <React.Fragment>
        <StyledEditor
            data={store.getValues()}
            onChange={(keys, value) => {
                onChange(
                    List(keys), ['value'],
                    () => ({value: value}),
                    false,
                )
            }}
            getVal={keys => store.getValues().getIn(keys)}
        />
        <StyledEditor data={schema} onChange={() => console.log('not implemented')} getVal={keys => schema.getIn(keys)}/>
    </React.Fragment>
};

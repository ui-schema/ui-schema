import {useUIStore} from '@ui-schema/ui-schema/UIStore';
import React from 'react';
import {List} from 'immutable';
import {useUIStoreActions} from '@ui-schema/ui-schema';

export const SchemaDebug = ({StyledEditor, schema}) => {
    const {store} = useUIStore();
    const {onChange} = useUIStoreActions();

    return <React.Fragment>
        <StyledEditor
            data={store.getValues()}
            onChange={(keys, value) => {
                onChange({
                    storeKeys: List(keys),
                    scopes: ['value'],
                    type: 'update',
                    updater: () => ({value: value}),
                    required: false,
                })
            }}
            getVal={keys => store.getValues().getIn(keys)}
        />
        <StyledEditor data={schema} onChange={() => console.log('not implemented')} getVal={keys => schema.getIn(keys)}/>
    </React.Fragment>
};

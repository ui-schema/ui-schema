import {useUIStore} from '@ui-schema/react/UIStore';
import React from 'react';
import {List} from 'immutable';
import {useUIStoreActions} from '@ui-schema/react/UIStoreActions';

export const SchemaDebug = ({StyledEditor, schema, setSchema}) => {
    const {store} = useUIStore();
    const {onChange} = useUIStoreActions();

    return <React.Fragment>
        <StyledEditor
            title={<code>UIStore.values</code>}
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
        <StyledEditor
            title={<code>Schema</code>}
            data={schema}
            onChange={(a, b) => setSchema(s => s.setIn(a, b))}
            getVal={keys => schema.getIn(keys)}
        />
    </React.Fragment>
};

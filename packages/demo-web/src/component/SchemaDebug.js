import {useUIStore} from '@ui-schema/react/UIStore';
import React, {useState} from 'react';
import {List} from 'immutable';
import {useUIStoreActions} from '@ui-schema/react/UIStoreActions';

export const SchemaDebug = (
    {
        StyledEditor, schema, setSchema,
        showInternals: showInternalsProp = false,
        showValidity: showValidityProp = false,
    },
) => {
    const {store} = useUIStore();
    const {onChange} = useUIStoreActions();
    const [showInternals, setShowInternals] = useState(showInternalsProp)
    const [showValidity, setShowValidity] = useState(showValidityProp)
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
            getVal={keys => keys.length ? store.getValues().getIn(keys) : store.getValues()}
        />
        {showInternals ?
            <StyledEditor
                title={<code>UIStore.internals</code>}
                data={store.getInternals()}
                getVal={keys => store.getInternals().getIn(keys)}
            /> : null}
        {showValidity ?
            <StyledEditor
                title={<code>UIStore.validity</code>}
                data={store.getValidity()}
                getVal={keys => store.getValidity().getIn(keys)}
            /> : null}
        <StyledEditor
            title={<code>Schema</code>}
            data={schema}
            onChange={(a, b) => setSchema(s => s.setIn(a, b))}
            getVal={keys => schema.getIn(keys)}
        />
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
            <button
                onClick={() => setShowInternals(s => !s)}
                style={{cursor: 'pointer', background: 'none', color: 'inherit', padding: '4px 6px', marginBottom: 6, border: '1px solid currentColor'}}
            >
                {showInternals ? 'hide' : 'show'}{' UIStore.internals'}
            </button>
            <button
                onClick={() => setShowValidity(s => !s)}
                style={{cursor: 'pointer', background: 'none', color: 'inherit', padding: '4px 6px', marginBottom: 6, border: '1px solid currentColor'}}
            >
                {showValidity ? 'hide' : 'show'}{' UIStore.validity'}
            </button>
        </div>
    </React.Fragment>
};

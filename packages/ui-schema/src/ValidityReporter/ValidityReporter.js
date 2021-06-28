import React from 'react';
import {getNextPlugin} from '@ui-schema/ui-schema/PluginStack';

export const ValidityReporter = (props) => {
    const {onChange, showValidity, storeKeys, valid, currentPluginIndex} = props;

    const storeKeysPrev = React.useRef(storeKeys);

    const sameStoreKeys = storeKeysPrev.current?.equals(storeKeys);

    if(!sameStoreKeys) {
        storeKeysPrev.current = storeKeys;
    }

    React.useEffect(() => {
        // todo: use `errors` instead of `valid`, but only if not `valid` and `hasErrors`
        if(sameStoreKeys) {
            onChange(storeKeysPrev.current, ['valid'], () => ({valid: valid}))
        }
    }, [valid, onChange, sameStoreKeys, storeKeysPrev]);

    React.useEffect(() => {
        // delete own validity state on component unmount
        return sameStoreKeys ? () => {
            onChange(storeKeys, ['valid'], () => ({valid: undefined}))
        } : undefined
    }, [onChange, sameStoreKeys, storeKeysPrev]);

    const next = currentPluginIndex + 1;
    const Plugin = getNextPlugin(next, props.widgets)
    return <Plugin {...props} currentPluginIndex={next} valid={valid} showValidity={showValidity}/>;
};

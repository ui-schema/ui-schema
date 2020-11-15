import React from 'react';
import {NextPluginRenderer} from '../PluginStack';
import {cleanUp, updateValidity} from '../UIStore';

export const ValidityReporter = (props) => {
    const {onChange, showValidity, storeKeys, valid} = props;

    const storeKeysPrev = React.useRef(storeKeys);

    const sameStoreKeys = storeKeysPrev.current?.equals(storeKeys);

    if(!sameStoreKeys) {
        storeKeysPrev.current = storeKeys;
    }

    React.useEffect(() => {
        // todo: use `errors` instead of `valid`, but only if not `valid` and `hasErrors`
        if(sameStoreKeys) {
            onChange(updateValidity(storeKeysPrev.current, valid));
        }
    }, [valid, onChange, sameStoreKeys, storeKeysPrev]);

    React.useEffect(() => {
        // delete own validity state on component unmount
        return sameStoreKeys ? () => {
            onChange(cleanUp(storeKeysPrev.current, 'validity'));
        } : undefined
    }, [onChange, sameStoreKeys, storeKeysPrev]);

    return <NextPluginRenderer {...props} valid={valid} showValidity={showValidity}/>;
};

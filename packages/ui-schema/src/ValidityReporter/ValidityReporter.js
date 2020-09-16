import React from 'react';
import {NextPluginRenderer} from '../EditorPluginStack';
import {cleanUp, updateValidity} from '../EditorStore';

export const ValidityReporter = (props) => {
    const storeKeysPrev = React.useRef(undefined);
    const {
        onChange, showValidity,
        storeKeys,
    } = props;
    let {errors, valid} = props;

    const sameStoreKeys = storeKeysPrev.current && storeKeysPrev.current.equals(storeKeys);

    if(!sameStoreKeys) {
        storeKeysPrev.current = storeKeys;
    }

    React.useEffect(() => {
        onChange(updateValidity(storeKeys, valid));

        return () => {
            // delete own validity state on component unmount
            onChange(cleanUp(storeKeys, 'validity'));
        };
    }, [valid, sameStoreKeys]);

    return <NextPluginRenderer {...props} valid={valid} errors={errors} showValidity={showValidity}/>;
};

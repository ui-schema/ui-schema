import React from 'react';
import {NextPluginRenderer} from '../PluginStack';
import {cleanUp, updateValidity} from '../UIStore';

export const ValidityReporter = (props) => {
    //const storeKeysPrev = React.useRef(undefined);
    const {
        onChange, showValidity,
        storeKeys,
    } = props;
    let {errors, valid} = props;

    // todo: somehow validity for e.g. stepper is not set correctly when effect uses sameStoreKeys
    //const sameStoreKeys = storeKeysPrev.current && storeKeysPrev.current.equals(storeKeys);

    //if(!sameStoreKeys) {
        //storeKeysPrev.current = storeKeys;
    //}

    React.useEffect(() => {
        // todo: use `errors` instead of `valid`, but only if `valid` and `hasErrors`
        onChange(updateValidity(storeKeys, valid));

        return () => {
            // delete own validity state on component unmount
            onChange(cleanUp(storeKeys, 'validity'));
        };
    }, [valid/*, sameStoreKeys*/]);

    return <NextPluginRenderer {...props} valid={valid} errors={errors} showValidity={showValidity}/>;
};

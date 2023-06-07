import React from 'react';
import {getNextPlugin} from '@ui-schema/ui-schema/PluginStack';
import {useImmutable} from '@ui-schema/ui-schema/Utils/useImmutable';

export const ValidityReporter = (props) => {
    const [customError, setCustomError] = React.useState(false)
    const {onChange, showValidity, storeKeys, valid, currentPluginIndex} = props;

    const storeKeysRef = useImmutable(storeKeys)

    const realValid = !customError && valid

    React.useEffect(() => {
        // todo: use `errors` instead of `valid`, but only if not `valid` and `hasErrors`
        // todo: this will run on each mount, check if necessary
        onChange({
            type: 'set',
            storeKeys: storeKeysRef,
            scopes: ['valid'],
            data: {
                valid: props.errors.get('errors'),
            },
        })
    }, [realValid, onChange, storeKeysRef, customError]);

    React.useEffect(() => {
        // delete own validity state on component unmount
        //return () => onChange(storeKeysRef, ['valid'], () => ({valid: undefined}))
        return () =>
            onChange({
                type: 'set',
                storeKeys: storeKeysRef,
                scopes: ['valid'],
                data: {
                    valid: undefined,
                },
            })
        /*return () => onChange({
            type: 'element-delete',
            storeKeys: storeKeysRef,
            scopes: ['valid'],
        })*/
    }, [onChange, storeKeysRef]);

    const next = currentPluginIndex + 1;
    const Plugin = getNextPlugin(next, props.widgets)
    return <Plugin {...props} currentPluginIndex={next} valid={valid} showValidity={showValidity} setCustomError={setCustomError}/>;
};

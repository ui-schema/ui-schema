import React from 'react';
import {NextPluginRenderer} from '@ui-schema/ui-schema/PluginStack';
import {useImmutable} from '@ui-schema/ui-schema/Utils/useImmutable';

const DefaultValueHandler = ({defaultVal, ...props}) => {
    const [defaultHandled, setDefaultHandled] = React.useState(false);
    const {onChange, storeKeys} = props;
    let {value} = props;

    const currentStoreKeys = useImmutable(storeKeys)

    React.useEffect(() => {
        setDefaultHandled(false);
    }, [currentStoreKeys]);

    React.useEffect(() => {
        if(typeof value === 'undefined' && !defaultHandled) {
            setDefaultHandled(true);
            onChange(currentStoreKeys, ['value'], () => ({value: defaultVal}))
        } else if(!defaultHandled) {
            setDefaultHandled(true);
        }
    }, [onChange, currentStoreKeys, defaultVal, value, defaultHandled]);

    let nextValue = value;
    if(typeof value === 'undefined' && !defaultHandled) {
        nextValue = defaultVal;
    }

    return <NextPluginRenderer {...props} value={nextValue}/>;
};

const DefaultHandler = (props) => {
    const {schema} = props;

    let defaultVal = schema.get('default');

    return typeof defaultVal !== 'undefined' ?
        <DefaultValueHandler {...props} defaultVal={defaultVal}/> :
        <NextPluginRenderer {...props}/>;
};

export {DefaultHandler}

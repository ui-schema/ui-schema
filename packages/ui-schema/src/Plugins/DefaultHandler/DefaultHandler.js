import React from 'react';
import {getNextPlugin} from '@ui-schema/ui-schema/PluginStack';
import {useImmutable} from '@ui-schema/ui-schema/Utils/useImmutable';

const DefaultValueHandler = (
    {
        defaultVal,
        Plugin, currentPluginIndex,
        ...props
    },
) => {
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

    return <Plugin {...props} value={nextValue} currentPluginIndex={currentPluginIndex}/>;
};

const DefaultHandler = (props) => {
    const {schema, currentPluginIndex} = props;
    const next = currentPluginIndex + 1;
    const Plugin = getNextPlugin(next, props.widgets)

    let defaultVal = schema.get('default');

    return typeof defaultVal !== 'undefined' ?
        <DefaultValueHandler {...props} defaultVal={defaultVal} Plugin={Plugin} currentPluginIndex={next}/> :
        <Plugin {...props} currentPluginIndex={next}/>;
};

export {DefaultHandler}

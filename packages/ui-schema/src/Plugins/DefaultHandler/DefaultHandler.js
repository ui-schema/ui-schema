import React from 'react';
import {NextPluginRenderer} from '../../PluginStack';

const DefaultValueHandler = ({defaultVal, ...props}) => {
    const storeKeysPrev = React.useRef(undefined);
    const [defaultHandled, setDefaultHandled] = React.useState(false);
    const {onChange, storeKeys} = props;
    let {value} = props;

    const sameStoreKeys = storeKeysPrev.current && storeKeysPrev.current.equals(storeKeys);

    if(!sameStoreKeys) {
        storeKeysPrev.current = storeKeys;
    }

    React.useEffect(() => {
        if(defaultHandled && !sameStoreKeys) {
            setDefaultHandled(false);
        }
    }, [defaultHandled, sameStoreKeys, defaultVal]);

    React.useEffect(() => {
        if(typeof value === 'undefined' && !defaultHandled) {
            setDefaultHandled(true);
            onChange(storeKeys, ['value'], () => ({value: defaultVal}))
        }
    }, [onChange, sameStoreKeys, defaultVal, value, defaultHandled]);

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

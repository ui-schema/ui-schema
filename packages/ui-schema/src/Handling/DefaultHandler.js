import React from "react";
import {NextPluginRenderer} from "../Schema/EditorWidgetStack";
import {updateValue} from "..";

const DefaultValueHandler = ({defaultVal, ...props}) => {
    const {onChange, storeKeys} = props;
    let {value} = props;

    const initialValue = value;
    React.useEffect(() => {
        if(typeof initialValue === 'undefined') {
            onChange(updateValue(storeKeys, defaultVal));
        }
    }, [onChange, storeKeys, defaultVal, initialValue]);

    if(typeof value === 'undefined') {
        value = defaultVal;
    }

    return <NextPluginRenderer {...props} value={value}/>;
};

const DefaultHandler = (props) => {
    const {schema,} = props;

    let defaultVal = schema.get('default');

    return typeof defaultVal !== 'undefined' ?
        <DefaultValueHandler {...props} defaultVal={defaultVal}/> :
        <NextPluginRenderer {...props}/>;
};

export {DefaultHandler}

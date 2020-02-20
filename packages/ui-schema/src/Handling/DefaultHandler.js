import React from "react";
import {NextPluginRenderer} from "../Schema/EditorWidgetStack";

const DefaultValueHandler = ({defaultVal, ...props}) => {
    const {onChange, storeKeys} = props;
    let {value} = props;

    React.useEffect(() => {
        if(typeof value === 'undefined') {
            onChange(store => store.setIn(storeKeys, defaultVal));
        }
    }, [onChange, storeKeys, defaultVal]);

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

import React from "react";
import {NextPluginRenderer} from "../Schema/Editor";

const SchemaDefaultHandler = (props) => {
    const {
        schema, value, setData, storeKeys
    } = props;

    let default_val = schema.get('default');
    if(typeof value === 'undefined') {
        if(typeof default_val !== 'undefined') {
            setData(storeKeys, default_val)
        }
    }

    return (typeof value !== 'undefined' && typeof default_val !== 'undefined') || typeof default_val === 'undefined'
        ? <NextPluginRenderer {...props}/> : null;
};

export {SchemaDefaultHandler}

import React from "react";
import {NextPluginRenderer} from "../Schema/EditorWidgetStack";

const DefaultHandler = (props) => {
    const {
        schema, value, onChange, storeKeys
    } = props;

    let default_val = schema.get('default');
    if(typeof value === 'undefined') {
        if(typeof default_val !== 'undefined') {
            onChange(store => store.setIn(storeKeys, default_val))
        }
    }

    return (typeof value !== 'undefined' && typeof default_val !== 'undefined') || typeof default_val === 'undefined'
        ? <NextPluginRenderer {...props}/> : null;
};

export {DefaultHandler}

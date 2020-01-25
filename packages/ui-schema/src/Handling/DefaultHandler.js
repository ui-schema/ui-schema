import React from "react";
import {NextPluginRenderer} from "../Schema/Editor";

const DefaultHandler = (props) => {
    const {
        schema, value, setData, storeKeys
    } = props;

    let default_val = schema.get('default');
    if(typeof value === 'undefined') {
        if(typeof default_val !== 'undefined') {
            // todo:
            //   on object/array: what if manually removed default entry?
            //   all other types will have some other default then `undefined` when unselected
            setData(storeKeys, default_val)
        }
    }

    return (typeof value !== 'undefined' && typeof default_val !== 'undefined') || typeof default_val === 'undefined'
        ? <NextPluginRenderer {...props}/> : null;
};

export {DefaultHandler}

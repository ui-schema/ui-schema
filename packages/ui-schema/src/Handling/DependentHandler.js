import React from "react";
import {NextPluginRenderer} from "../Schema/Editor";

/*
 dependant handler:
 one component that checks if the schema has a dependant
 - if it has: call another component that uses the hook (and is a PureComponent)
 - not: call the next-plugin
 thus only widget scopes where a dependent is existing will have a logic-only re-render (when dependant state changed, big re-render)
 */
const DependentHandler = (props) => {
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

export {DependentHandler}

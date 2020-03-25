import React from "react";
import {NextPluginRenderer} from "../Schema/EditorPluginStack";

export const ValidatorStack = (props) => {
    if(props.widgets.validators && Array.isArray(props.widgets.validators)) {
        props.widgets.validators.forEach(validator => {
            if(typeof validator.validate !== 'function') {
                return;
            }

            if(typeof validator.should === 'function') {
                if(!validator.should(props)) {
                    if(typeof validator.noValidate === 'function') {
                        props = {...props, ...validator.noValidate(props)};
                    }
                    return;
                }
            }

            props = {...props, ...validator.validate(props)};
        });
    }

    return <NextPluginRenderer {...props}/>;
};

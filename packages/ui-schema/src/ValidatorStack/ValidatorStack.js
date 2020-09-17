import React from 'react';
import {NextPluginRenderer} from '../PluginStack';

export const handleValidatorStack = (props) => {
    if(props.widgets && props.widgets.validators && Array.isArray(props.widgets.validators)) {
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

    return props;
}

export const ValidatorStack = (props) =>
    <NextPluginRenderer {...handleValidatorStack(props)}/>;

import React from 'react';
import {getNextPlugin} from '@ui-schema/ui-schema/PluginStack';

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

export const ValidatorStack = ({currentPluginIndex, ...props}) => {
    const next = currentPluginIndex + 1;
    const Plugin = getNextPlugin(next, props.widgets)
    return <Plugin {...handleValidatorStack(props)} currentPluginIndex={next}/>;
}

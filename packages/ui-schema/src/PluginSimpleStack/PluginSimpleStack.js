import React from 'react';
import {getNextPlugin} from '@ui-schema/ui-schema/PluginStack/PluginStack';

export const handlePluginSimpleStack = (props, pluginSimpleStack) => {
    if(pluginSimpleStack && Array.isArray(pluginSimpleStack)) {
        pluginSimpleStack.forEach(propsPlugin => {
            if(typeof propsPlugin.handle !== 'function') {
                return;
            }

            if(typeof propsPlugin.should === 'function') {
                if(!propsPlugin.should(props)) {
                    if(typeof propsPlugin.noHandle === 'function') {
                        props = {...props, ...propsPlugin.noHandle(props)};
                    }
                    return;
                }
            }

            props = {...props, ...propsPlugin.handle(props)};
        });
    }

    return props;
}

export const PluginSimpleStack = ({currentPluginIndex, ...props}) => {
    const next = currentPluginIndex + 1;
    const Plugin = getNextPlugin(next, props.widgets)
    return <Plugin {...handlePluginSimpleStack(props, props.widgets.pluginSimpleStack)} currentPluginIndex={next}/>;
}

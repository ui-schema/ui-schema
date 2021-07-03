import React from 'react';
import {Map} from 'immutable';
import {getNextPlugin} from '@ui-schema/ui-schema/PluginStack/PluginStack';

const DefaultHandler = (props) => {
    const {schema, currentPluginIndex, doNotDefault, readOnly} = props;
    const next = currentPluginIndex + 1;
    const Plugin = getNextPlugin(next, props.widgets)

    let defaultVal = schema.get('default');

    const {onChange, storeKeys} = props;
    let {value, internalValue} = props;

    const valRef = React.useRef(value)
    valRef.current = value
    const defaultHandled = Boolean(internalValue?.get('defaultHandled') || doNotDefault || readOnly || schema?.get('readOnly'))
    React.useEffect(() => {
        if(defaultHandled) return
        if(typeof defaultVal === 'undefined') return

        if(typeof valRef.current === 'undefined') {
            onChange(storeKeys, ['value', 'internal'], ({internal = Map()}) => ({
                value: defaultVal,
                internal: internal.set('defaultHandled', true),
            }))
        } else {
            onChange(storeKeys, ['internal'], ({internal = Map()}) => ({
                internal: internal.set('defaultHandled', true),
            }))
        }
    }, [onChange, storeKeys, defaultHandled, defaultVal, valRef]);

    let nextValue = value;
    if(typeof value === 'undefined' && !defaultHandled) {
        nextValue = defaultVal;
    }

    return <Plugin {...props} value={nextValue} currentPluginIndex={currentPluginIndex}/>;
};

export {DefaultHandler}

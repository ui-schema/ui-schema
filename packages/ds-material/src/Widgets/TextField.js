import React from "react";
import {
    TextField
} from "@material-ui/core";
import {unstable_trace as trace} from "scheduler/tracing";
import {beautifyKey} from "@ui-schema/ui-schema";
import {List} from 'immutable';

const StringRenderer = ({type, ownKey, schema, value, multiline, showValidity, rows, rowsMax, setData, storeKeys, valid, required}) => {
    const format = schema.get('format');
    const fieldType = format === 'date' ? 'date' : type;

    let isRequired = schema.get('required');
    if(required && !isRequired) {
        if(List.isList(required)) {
            isRequired = required.contains(ownKey);
        }
    }
    // todo:: show errors, show invalid only after blur or when required

    return <TextField
        label={beautifyKey(ownKey)}
        type={fieldType}
        multiline={multiline}
        required={isRequired}
        error={(!valid || (isRequired && !value)) && showValidity}
        rows={rows}
        rowsMax={rowsMax}
        fullWidth
        variant={schema.getIn(['view', 'variant'])}
        margin={schema.getIn(['view', 'margin'])}
        value={value ? value : (schema.get('default') || '')}
        onChange={(e) => trace("textfield onchange", performance.now(), () => {
            switch(fieldType) {
                case 'number':
                    if(isNaN(e.target.value * 1)) {
                        console.error('Invalid Type: input not a number in:', e.target);
                        return;
                    }
                    setData(storeKeys, e.target.value * 1);
                    break;

                default:
                    setData(storeKeys, e.target.value);
                    break;
            }
        })}
    />
};

const TextRenderer = ({schema, ...props}) => {
    return <StringRenderer
        {...props}
        schema={schema}
        rows={schema.getIn(['view', 'rows'])}
        rowsMax={schema.getIn(['view', 'rowsMax'])}
        multiline
    />
};

const NumberRenderer = ({schema, ...props}) => {
    return <StringRenderer
        {...props}
        schema={schema}
        type={'number'}
    />
};

export {StringRenderer, NumberRenderer, TextRenderer};

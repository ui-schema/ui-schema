import React from "react";
import {
    TextField
} from "@material-ui/core";
import {unstable_trace as trace} from "scheduler/tracing";
import {beautifyKey} from "@ui-schema/ui-schema";

const StringRenderer = ({type, ownKey, schema, value, multiline, rows, rowsMax, onChange, storeKeys, showValidity, valid, required}) => {
    const format = schema.get('format');
    const fieldType = format === 'date' ? 'date' : type;

    return <TextField
        label={beautifyKey(ownKey)}
        type={fieldType}
        multiline={multiline}
        required={required}
        error={!valid && showValidity}
        rows={rows}
        rowsMax={rowsMax}
        fullWidth
        variant={schema.getIn(['view', 'variant'])}
        margin={schema.getIn(['view', 'margin'])}
        value={value || ''}
        onChange={(e) => trace("textfield onchange", performance.now(), () => {
            const value = e.target.value;
            switch(fieldType) {
                case 'number':
                    if(isNaN(value * 1)) {
                        console.error('Invalid Type: input not a number in:', e.target);
                        return;
                    }
                    onChange(store => store.setIn(storeKeys, value * 1));
                    break;

                default:
                    onChange(store => store.setIn(storeKeys, value));
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

import React from "react";
import {List, Map} from "immutable";
import {
    TextField
} from "@material-ui/core";
import {unstable_trace as trace} from "scheduler/tracing";
import {beautifyKey, updateValue} from "@ui-schema/ui-schema";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const StringRenderer = ({
                            type,
                            multiline, rows, rowsMax,
                            storeKeys, ownKey, schema, value, onChange,
                            onValidity, showValidity, valid, errors, required,
                            InputProps = {},
                        }) => {
    const inputRef = React.useRef();
    const format = schema.get('format');
    const currentRef = inputRef.current;

    let typeMismatch = false;
    if(currentRef && format) {
        // todo: better native-browser error support (only for formats like e.g. email, date, number; otherwise errors would be duplicate)
        typeMismatch = inputRef.current.validity.typeMismatch;
        if(typeMismatch) {
            errors = errors.push(List(['format-mismatch', Map({browserMessage: inputRef.current.validationMessage})]));
            valid = false;
        }
    }

    React.useEffect(() => {
        if(onValidity) {
            onValidity(updateValue(storeKeys, Map({'__valid': valid})));
        }
    }, [valid]);

    return <React.Fragment>
        <TextField
            label={beautifyKey(ownKey, schema.get('tt'))}
            type={format || type}
            multiline={multiline}
            required={required}
            error={!valid && showValidity}
            rows={rows}
            inputRef={inputRef}
            rowsMax={rowsMax}
            fullWidth
            variant={schema.getIn(['view', 'variant'])}
            margin={schema.getIn(['view', 'margin'])}
            size={schema.getIn(['view', 'dense']) ? 'small' : 'medium'}
            value={typeof value !== 'undefined' ? value : ''}
            onChange={(e) => trace("textfield onchange", performance.now(), () => {
                const value = e.target.value;
                if(type === 'number') {
                    if(isNaN(value * 1)) {
                        console.error('Invalid Type: input not a number in:', e.target);
                        return;
                    }
                    onChange(updateValue(storeKeys, value * 1));

                    return;
                }

                onChange(updateValue(storeKeys, value));
            })}
            InputLabelProps={{shrink: schema.getIn(['view', 'shrink'])}}
            InputProps={InputProps}
        />

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
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

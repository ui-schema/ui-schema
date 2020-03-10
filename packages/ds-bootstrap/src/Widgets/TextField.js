import React from "react";
import {unstable_trace as trace} from "scheduler/tracing";
import {beautifyKey, updateValue} from "@ui-schema/ui-schema";
import {ValidityHelperText} from "../Component/LocaleHelperText";
import {useUID} from "react-uid";

const StringRenderer = ({ownKey, schema, value, multiline, onChange, storeKeys, showValidity, required, errors, type, rows}) => {
    const format = schema.get('format');
    const uid = useUID();

    let Renderer = 'input';
    if(multiline) {
        Renderer = 'textarea';
    }

    let classFormGroup = ["form-group"];
    let classFormControl = ["form-control"];
    if(showValidity && errors.size) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.size) {
        classFormGroup.push('was-validated');
    }

    return <div className={classFormGroup.join(' ')}>
        <label htmlFor={'uis-' + uid}>{beautifyKey(ownKey)}</label>
        <Renderer
            className={classFormControl.join(' ')}
            type={format || type}
            required={required}
            rows={rows}
            value={typeof value !== 'undefined' ? value : ''}
            onChange={(e) => trace("textfield onchange", performance.now(), () => {
                const value = e.target.value;
                const target = e.target;
                if(type === 'number') {
                    if(isNaN(value * 1)) {
                        console.error('Invalid Type: input not a number in:', target);
                        return;
                    }
                    onChange(updateValue(storeKeys, value * 1));
                } else {
                    onChange(updateValue(storeKeys, value));
                }
            })}/>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>;
};

const TextRenderer = ({schema, ...props}) => {
    return <StringRenderer
        {...props}
        schema={schema}
        rows={schema.getIn(['view', 'rows'])}
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

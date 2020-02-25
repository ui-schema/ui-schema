import React from "react";

import {unstable_trace as trace} from "scheduler/tracing";
import {beautifyKey, updateValue} from "@ui-schema/ui-schema";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const StringRenderer = ({ownKey, schema, value, multiline, onChange, storeKeys, showValidity, required, errors}) => {
    let Renderer = 'input';
    if(multiline) {
        Renderer = 'textarea';
    }

    let classFormControl = ["form-control"];
    if(showValidity && errors.size) {
        classFormControl.push('is-invalid');
    }

    return <div className={"form-group"} noValidate>
        <label htmlFor={ownKey}>{beautifyKey(ownKey)}</label>
        <Renderer
            className={classFormControl.join(' ')}
            required={required}
            value={value || ''}
            onChange={(e) => trace("textfield onchange", performance.now(), () => {
                const value = e.target.value;
                onChange(updateValue(storeKeys, value));
            })}/>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>;
};

export {StringRenderer};

import React from "react";

import {unstable_trace as trace} from "scheduler/tracing";
import {beautifyKey} from "@ui-schema/ui-schema";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const StringRenderer = ({ownKey, schema, value, multiline, rows, onChange, storeKeys, showValidity, required, errors}) => {

    let Renderer = 'input';
    if(multiline) {
        Renderer = 'textarea';
    }

    let classFormControl = ["form-control"];
    let classForm = ["needs-validation"];
    if(showValidity && errors.size) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.size) {
        classForm.push('was-validated');
    }

    return <form className={classForm.join(' ')}>
        <div className={"form-group"} noValidate>
            <label htmlFor={ownKey}>{beautifyKey(ownKey)}</label>
            <Renderer
                className={classFormControl.join(' ')}
                required={required}
                rows={rows}
                value={value || ''}
                onChange={(e) => trace("textfield onchange", performance.now(), () => {
                    const value = e.target.value;
                    onChange(store => store.setIn(storeKeys, value));
                })}/>
            <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
        </div>
    </form>;
};

export {StringRenderer};

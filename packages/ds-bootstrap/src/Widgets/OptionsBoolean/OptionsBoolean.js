import React from "react";
import {unstable_trace as trace} from "scheduler/tracing";
import {TransTitle, updateValue} from "@ui-schema/ui-schema";


const BoolRenderer = ({ownKey, showValidity, required, errors, value, storeKeys, onChange, schema}) => {

    let classForm = ["custom-control", "custom-switch"];
    let classLabel = ["custom-control-label", "text-light"];
    let classFormControl = ["custom-control-input"];
    if(showValidity && errors.size) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.size) {
        classForm.push('was-validated');
    }

    let currentChecked = !!value;

    return <div className={classForm.join(' ')}>
        <input
            type="checkbox" className={classFormControl.join(' ')} id={ownKey}
            checked={currentChecked}
            required={required}
            onChange={() => trace("switch onchange", performance.now(), () => {
                onChange(updateValue(storeKeys, !currentChecked));
            })}
        />
        <label className={classLabel.join(' ')} htmlFor={ownKey}><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>{(required ? ' *' : '')}</label>
    </div>;
};

export {BoolRenderer};
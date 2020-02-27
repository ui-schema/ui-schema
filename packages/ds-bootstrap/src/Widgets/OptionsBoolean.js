import React from "react";
import {unstable_trace as trace} from "scheduler/tracing";
import {beautifyKey, updateValue} from "@ui-schema/ui-schema";


const BoolRenderer = ({ownKey, value, onChange, storeKeys, showValidity, valid, required, errors}) => {

    let classForm = ["custom-control", "custom-switch"];
    let classLabel = ["custom-control-label", "text-light"];
    let classFormControl = ["custom-control-input"];
    if(showValidity && errors.size) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.size) {
        classForm.push('was-validated');
    }

    const currentVal = !!value;
    return <div className={classForm.join(' ')}>
        <input type="checkbox" className={classFormControl.join(' ')} id={ownKey}
               required={required}
               checked={currentVal}
               onChange={() => trace("textfield onchange", performance.now(), () => {
                       onChange(updateValue(storeKeys, !currentVal));
               })}/>
        <label className={classLabel.join(' ')}  htmlFor={ownKey}>{beautifyKey(ownKey) + (required ? ' *' : '')}</label>
    </div>;


};

export {BoolRenderer};

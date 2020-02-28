import React from "react";
import {beautifyKey} from "@ui-schema/ui-schema";


const BoolRenderer = ({ownKey, showValidity, required, errors, value}) => {

    let classForm = ["custom-control", "custom-switch"];
    let classLabel = ["custom-control-label", "text-light"];
    let classFormControl = ["custom-control-input"];
    if(showValidity && errors.size) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.size) {
        classForm.push('was-validated');
    }

    let currentChecked = value ? true : undefined;

    return <div className={classForm.join(' ')}>
        <input type="checkbox" className={classFormControl.join(' ')} id={ownKey}
               defaultChecked={currentChecked}
               />
        <label className={classLabel.join(' ')} htmlFor={ownKey}>{beautifyKey(ownKey) + (required ? ' *' : '')}</label>
    </div>;


};

export {BoolRenderer};
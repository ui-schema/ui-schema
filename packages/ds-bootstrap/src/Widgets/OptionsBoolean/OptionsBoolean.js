import React from "react";
import {unstable_trace as trace} from "scheduler/tracing";
import {TransTitle, updateValue} from "@ui-schema/ui-schema";
import {ValidityHelperText} from "@ui-schema/ds-material/Component";


const BoolRenderer = ({ownKey, showValidity, required, errors, value, storeKeys, onChange, schema}) => {

    let classForm = ["custom-control", "custom-switch"];
    let classLabel = ["custom-control-label", "text-light"];
    let classFormControl = ["custom-control-input"];
    if(showValidity && errors.hasError()) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.hasError()) {
        classForm.push('was-validated');
    }

    let currentChecked = !!value;

    return <div className={classForm.join(' ')}>
        <input
            type="checkbox" className={classFormControl.join(' ')} id={ownKey}
            checked={currentChecked}
            required={required}
            onChange={() => trace("switch onchange", performance.now(), () => {
                onChange(updateValue(storeKeys, !currentChecked, required, schema.get('type')));
            })}
        />
        <label className={classLabel.join(' ')} htmlFor={ownKey}><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>{(required ? ' *' : '')}</label>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>;
};

export {BoolRenderer};

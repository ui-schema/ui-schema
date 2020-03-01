import React from "react";
import {beautifyKey, updateValue,} from "@ui-schema/ui-schema";
import {unstable_trace as trace} from "scheduler/tracing";
import {useUID} from "react-uid";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const RadioInput = ({classForm, enum_name, classLabel, required, classFormControl, value, onChange, storeKeys}) => {
    const uid = useUID();

    return <div
        className={classForm.join(' ')}
        key={enum_name}>
        <input
            required={required}
            id={'uis-' + uid}
            type="radio"
            className={classFormControl.join(' ')}
            checked={enum_name === value}
            onChange={() => trace("switch onchange", performance.now(), () => {
                onChange(updateValue(storeKeys, enum_name));
            })}/>
        <label
            className={classLabel.join(' ')}
            htmlFor={'uis-' + uid}
        >
            {beautifyKey(enum_name)}
        </label>
    </div>
};

const OptionsRadio = ({schema, value, onChange, storeKeys, showValidity, required, errors, ownKey}) => {
    const enumVal = schema.get('enum');

    if(!enumVal) return null;

    let classForm = ["custom-control", "custom-radio"];
    let classLabel = ["custom-control-label", "text-light"];
    let classFormControl = ["custom-control-input"];
    if(showValidity && errors.size) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.size) {
        classForm.push('was-validated');
    }

    return <React.Fragment>
        {enumVal ? enumVal.map((enum_name) => {
            return <RadioInput
                key={enum_name}
                classForm={classForm}
                enum_name={enum_name}
                classLabel={classLabel}
                required={required}
                ownKey={ownKey}
                classFormControl={classFormControl}
                value={value}
                onChange={onChange}
                storeKeys={storeKeys}
            />
        }).valueSeq() : null}

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
};

export {OptionsRadio};



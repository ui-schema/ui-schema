import React from "react";
import {beautifyKey, updateValue,} from "@ui-schema/ui-schema";
import {unstable_trace as trace} from "scheduler/tracing";
import {ValidityHelperText} from "../Component/LocaleHelperText";

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

    const currentValue = (typeof value !== 'undefined' && value.length > 0) ? value : ((schema.get('default')) ?  schema.get('default') : '');
    console.log('value: ' + currentValue);

    return <React.Fragment>
        {enumVal ? enumVal.map((enum_name) => {
            return <div className={classForm.join(' ')}
                        key={enum_name}>
                <label className={classLabel.join(' ')}
                       htmlFor={ownKey + '-' + enum_name}>
                    {beautifyKey(enum_name)}</label>
                <input required={required}
                       id={ownKey + '-' + enum_name}
                       type="radio"
                       value={enum_name}
                       name={ownKey}
                       className={classFormControl.join(' ')}
                       checked={enum_name === currentValue ? "checked" : undefined}
                       onChange={() => trace("switch onchange", performance.now(), () => {
                           onChange(updateValue(storeKeys, enum_name));
                       })}/>
            </div>
        }).valueSeq() : null}

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
};

export {OptionsRadio};



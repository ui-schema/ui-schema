import React from "react";
import {TransTitle, Trans, beautifyKey, updateValue} from "@ui-schema/ui-schema";
import {unstable_trace as trace} from "scheduler/tracing";
import {useUID} from "react-uid";
import {List, Map} from "immutable";
import {ValidityHelperText} from "../../Component/LocaleHelperText/LocaleHelperText";

const RadioInput = ({classForm, enumName, classLabel, required, classFormControl, value, onChange, storeKeys, label, schema}) => {
    const uid = useUID();

    return <div
        className={classForm.join(' ')}
        key={enumName}>
        <input
            required={required}
            id={'uis-' + uid}
            type="radio"
            className={classFormControl.join(' ')}
            checked={enumName === value}
            onChange={() => trace("switch onchange", performance.now(), () => {
                onChange(updateValue(storeKeys, enumName, required, schema.get('type')));
            })}/>
        <label
            className={classLabel.join(' ')}
            htmlFor={'uis-' + uid}
        >
            {label}
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
        <label><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/></label>
        {enumVal ? enumVal.map((enum_name) => {
            return <RadioInput
                key={enum_name}
                classForm={classForm}
                enumName={enum_name}
                classLabel={classLabel}
                required={required}
                ownKey={ownKey}
                classFormControl={classFormControl}
                value={value}
                onChange={onChange}
                storeKeys={storeKeys}
                schema={schema}
                label={<Trans
                    schema={schema.get('t')}
                    text={storeKeys.insert(0, 'widget').concat(List(['enum', enum_name])).join('.')}
                    context={Map({'relative': List(['enum', enum_name])})}
                    fallback={beautifyKey(enum_name)}
                />}
            />
        }).valueSeq() : null}

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
};

export {OptionsRadio};



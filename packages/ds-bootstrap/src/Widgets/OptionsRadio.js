import React from "react";
import {TransTitle, beautifyKey, updateValue, useEditor} from "@ui-schema/ui-schema";
import {unstable_trace as trace} from "scheduler/tracing";
import {useUID} from "react-uid";
import {List, Map} from "immutable";
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

    const {t} = useEditor();

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
            const s = enum_name + '';
            const Translated = t(s, Map({relative: List(['enum', s])}), schema.get('t'));
            return <RadioInput
                key={enum_name}
                classForm={classForm}
                enum_name={typeof Translated === 'string' || typeof Translated === 'number' ?
                    Translated :
                    beautifyKey(s)}
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



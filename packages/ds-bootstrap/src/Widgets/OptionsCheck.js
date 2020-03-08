import React from "react";
import {beautifyKey, extractValue, memo, updateValue} from "@ui-schema/ui-schema";
import {List} from "immutable";
import {useUID} from "react-uid";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const CheckInput = ({currentValue, onChange, label, enum_name, classForm, classLabel, classFormControl}) => {
    const uid = useUID();

    return <div className={classForm}>
        <input
            id={'uis-' + uid}
            type="checkbox"
            className={classFormControl}
            value={enum_name}
            checked={currentValue}
            onChange={onChange}/>
        <label
            className={classLabel}
            htmlFor={'uis-' + uid}
        >
            {label}
        </label>
    </div>
};

const OptionsCheckValue = extractValue(memo(({enumVal, storeKeys, value, onChange, classLabel, classFormControl, classForm}) => enumVal ?
    enumVal.map((enum_name) => {
        const currentValue = value && value.contains && typeof value.contains(enum_name) !== 'undefined' ? value.contains(enum_name) : false;

        return <CheckInput
            key={enum_name}
            value={enum_name}
            classForm={classForm}
            classLabel={classLabel}
            classFormControl={classFormControl}
            currentValue={currentValue}
            onChange={() => {
                if(currentValue) {
                    onChange(updateValue(storeKeys,
                        value.toList().delete(value.toList().indexOf(enum_name))))
                } else {
                    onChange(updateValue(
                        storeKeys,
                        value ? value.toList().push(enum_name) : List([]).push(enum_name))
                    );
                }
            }}
            label={beautifyKey(enum_name)}
        />
    }).valueSeq()
    : null
));

const OptionsCheck = ({schema, storeKeys, showValidity, errors}) => {
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
        <OptionsCheckValue
            className={classForm.join(' ')}
            classLabel={classLabel.join(' ')}
            classFormControl={classFormControl.join(' ')}
            enumVal={enumVal} storeKeys={storeKeys}/>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
};

export {OptionsCheck};



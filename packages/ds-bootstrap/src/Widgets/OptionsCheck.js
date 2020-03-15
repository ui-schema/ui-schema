import React from "react";
import {TransTitle, beautifyKey, useEditor, extractValue, memo, updateValue} from "@ui-schema/ui-schema";
import {List, Map} from "immutable";
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

const OptionsCheckValue = extractValue(memo(({enumVal, storeKeys, value, onChange, classLabel, classFormControl, classForm, schema}) => enumVal ?
    enumVal.map((enum_name) => {
        const currentValue = value && value.contains && typeof value.contains(enum_name) !== 'undefined' ? value.contains(enum_name) : false;
        const {t} = useEditor();
        const s = enum_name + '';
        const Translated = t(s, Map({relative: List(['enum', s])}), schema.get('t'));

        return <CheckInput
            key={enum_name}
            value={typeof Translated === 'string' || typeof Translated === 'number' ?
                Translated :
                beautifyKey(s)}
            classForm={classForm}
            classLabel={classLabel}
            classFormControl={classFormControl}
            currentValue={currentValue}
            onChange={() => {
                if(currentValue) {
                    onChange(updateValue(storeKeys,
                        value.delete(value.indexOf(enum_name))))
                } else {
                    onChange(updateValue(
                        storeKeys,
                        value ? value.push(enum_name) : List([]).push(enum_name))
                    );
                }
            }}
            label={beautifyKey(enum_name)}
        />
    }).valueSeq()
    : null
));

const OptionsCheck = ({schema, storeKeys, showValidity, errors, ownKey}) => {
    const enumVal = schema.get('enum');

    if(!enumVal) return null;

    let classForm = ["custom-control", "custom-checkbox"];
    let classLabel = ["custom-control-label", "text-light"];
    let classFormControl = ["custom-control-input", "checkbox-inline"];
    if(showValidity && errors.size) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.size) {
        classForm.push('was-validated');
    }

    return <React.Fragment>
        <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
        <OptionsCheckValue
            classForm={classForm.join(' ')}
            classLabel={classLabel.join(' ')}
            classFormControl={classFormControl.join(' ')}
            enumVal={enumVal} storeKeys={storeKeys} schema={schema}/>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
};

export {OptionsCheck};



import React from "react";
import {TransTitle, Trans, beautifyKey, extractValue, memo, updateValue} from "@ui-schema/ui-schema";
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
                        value.delete(value.indexOf(enum_name))))
                } else {
                    onChange(updateValue(
                        storeKeys,
                        value ? value.push(enum_name) : List([]).push(enum_name))
                    );
                }
            }}
            label={<Trans
                schema={schema.get('t')}
                text={storeKeys.insert(0, 'widget').concat(List(['enum', enum_name])).join('.')}
                context={Map({'relative': List(['enum', enum_name])})}
                fallback={beautifyKey(enum_name)}
            />}
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



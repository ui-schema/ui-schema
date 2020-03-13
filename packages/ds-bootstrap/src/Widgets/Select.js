import React from "react";
import {beautifyKey, extractValue, memo, updateValue,} from "@ui-schema/ui-schema";
import {List} from "immutable";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const Option = ({currentValue, onChange, innerValue}) => {


    return <React.Fragment>
        <option
            value={currentValue}
            onChange={onChange}>
            {innerValue}
        </option>
    </React.Fragment>
};

const SelectValue = extractValue(memo(({enumVal, storeKeys, value, onChange, multiple, schema}) => enumVal ?

    enumVal.map((enum_name) => {
        let currentValue = undefined;
        if(multiple) {
            currentValue = typeof value !== 'undefined' ? value : (List(schema.get('default')) || List());
        } else {
            currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '');
        }

        return <Option
            key={enum_name}
            innerValue={enum_name}
            currentValue={currentValue}
            onChange={(e) => {
                multiple ? onChange(updateValue(storeKeys, List(e.target.value))) : onChange(updateValue(storeKeys, e.target.value))
            }}
            label={beautifyKey(enum_name)}
        />
    }).valueSeq()
    : null
));

const Select = ({schema, storeKeys, showValidity, errors, ownKey}) => {
    const enumVal = schema.get('enum');

    if(!enumVal) return null;

    /*let classForm = ["custom-select"];
    let classLabel = ["custom-control-label", "text-light"];
    let classFormControl = ["custom-control-input"];
    if(showValidity && errors.size) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.size) {
        classForm.push('was-validated');
    } */

    return <React.Fragment>
        <div>{beautifyKey(ownKey)}</div>
        <select>
            <SelectValue
                enumVal={enumVal} storeKeys={storeKeys} schema={schema}/>
        </select>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
};

export {Select};
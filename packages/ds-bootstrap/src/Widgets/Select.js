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

/*const SelectValue = extractValue(memo(({enumVal, storeKeys, value, onChange, multiple}) => enumVal ?

    enumVal.map((enum_name) => {
        let currentValue = undefined;
        if(multiple) {
            currentValue = value && value.contains && typeof value.contains(enum_name) !== 'undefined' ? value.contains(enum_name) : false;
        } else {
            currentValue = typeof value !== 'undefined' && value === enum_name ? value : false;
            console.log(currentValue)
        }

        return <Option
            key={enum_name}
            innerValue={enum_name}
            value={multiple ? currentValue : enum_name === value}
            onChange={() => {
                console.log('change')
                multiple ? (currentValue ? onChange(updateValue(storeKeys,
                    value.delete(value.indexOf(enum_name)))) : onChange(updateValue(
                    storeKeys,
                    value ? value.push(enum_name) : List([]).push(enum_name))
                )) :
                    console.log('blaaa')
                    onChange(updateValue(storeKeys, enum_name))
            }}
            label={beautifyKey(enum_name)}
        />
    }).valueSeq()
    : null
)); */

const SelectValue = ({
                    multiple,
                    storeKeys, schema, value, onChange,
                }) => {
    if(!schema) return null;

    const enum_val = schema.get('enum');
    if(!enum_val) return null;

    if(multiple) {
        let currentValue = typeof value !== 'undefined' ? value : (List(schema.get('default')) || List());

        return <React.Fragment>
            {enum_val ? enum_val.map((enum_name) => {
                return <Option
                    key={enum_name}
                    innerValue={enum_name}
                    value={currentValue.toArray().includes(enum_name)}
                    onChange={(e) => {
                        onChange(updateValue(storeKeys, List(e.target.value)))
                    }}
                    label={beautifyKey(enum_name)}
                />
            }).valueSeq() : null}
        </React.Fragment>;
    } else {
       let currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '');

        return <React.Fragment>
            {enum_val ? enum_val.map((enum_name) => {
                return <Option
                    key={enum_name}
                    innerValue={enum_name}
                    value={enum_name === currentValue}
                    onChange={(e) => {
                        onChange(updateValue(storeKeys, e.target.value))
                    }}
                    label={beautifyKey(enum_name)}
                />
            }).valueSeq() : null}
        </React.Fragment>;
    }
};

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
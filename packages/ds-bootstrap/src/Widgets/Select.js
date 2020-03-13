import React from "react";
import {beautifyKey, updateValue} from "@ui-schema/ui-schema";
import {List} from "immutable";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const Option = ({currentValue, innerValue}) => {
    return <React.Fragment>
        <option
            selected={currentValue}>
            {innerValue}
        </option>
    </React.Fragment>
};


const SelectValue = ({schema, currentValue, enum_val}) => {
    if(!schema) return null;

    return <React.Fragment>
        {enum_val ? enum_val.map((enum_name) => {
            return <Option
                key={enum_name}
                innerValue={enum_name}
                selected={enum_name === currentValue}
            />
        }).valueSeq() : null}
    </React.Fragment>;
};


const SelectFrame = ({schema, storeKeys, showValidity, errors, ownKey, value, onChange, multiple = false, currentValue}) => {
    const enum_val = schema.get('enum');

    if(!enum_val) return null;

    let classForm = ["selectpicker", "custom-select"];
    let classFormParent = ["form-group"];
    if(showValidity && errors.size) {
        classFormParent.push('is-invalid');
    }
    if(showValidity && !errors.size) {
        classFormParent.push('was-validated');
    }

    return <div className={classFormParent.join(' ')}>
        <label>{beautifyKey(ownKey)}</label>
        <select value={value ? value : ''}
            className={classForm.join(' ')}
            onChange={(e) => {
                    if(multiple) {
                        onChange(updateValue(storeKeys, List(e.target.value)))
                    } else {
                        onChange(updateValue(storeKeys, e.target.value));
                    }
                }}>
            <SelectValue
                enum_val={enum_val}
                storeKeys={storeKeys}
                schema={schema}
                currentValue={currentValue}/>
        </select>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>
};

const Select = ({schema, storeKeys, showValidity, errors, ownKey, value, onChange}) => {
    let currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '');

    return <SelectFrame
        schema={schema}
        storeKeys={storeKeys}
        showValidity={showValidity}
        errors={errors}
        ownKey={ownKey}
        onChange={onChange}
        currentValue={currentValue}/>
};

const SelectMulti = ({schema, storeKeys, showValidity, errors, ownKey, value, onChange, multiple}) => {
    let currentValue = typeof value !== 'undefined' ? value : (List(schema.get('default')) || List());

    return <SelectFrame
        schema={schema}
        storeKeys={storeKeys}
        showValidity={showValidity}
        errors={errors}
        ownKey={ownKey}
        onChange={onChange}
        multiple={multiple}
        currentValue={currentValue}/>
};

export {Select, SelectMulti};
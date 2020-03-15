import React from "react";
import {TransTitle, useEditor, beautifyKey, updateValue, extractValue, memo} from "@ui-schema/ui-schema";
import {List, Map} from "immutable";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const Select = ({schema, storeKeys, showValidity, errors, ownKey, value, onChange, multiple = false}) => {
    const enum_val = schema.get('enum');
    const {t} = useEditor();

    if(!enum_val) return null;
    if(!schema) return null;

    let classForm = ["selectpicker", "custom-select"];
    let classFormParent = ["form-group"];
    if(showValidity && errors.size) {
        classFormParent.push('is-invalid');
    }
    if(showValidity && !errors.size) {
        classFormParent.push('was-validated');
    }
    let currentValue = undefined;
    if(multiple) {
        currentValue = typeof value !== 'undefined' ? value : (List(schema.get('default')) || List([]));
    } else {
        currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '');
    }
    return <div className={classFormParent.join(' ')}>
        <label><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/></label>
        <select
            value={multiple ? currentValue.toArray() : currentValue}
            className={classForm.join(' ')}
            multiple={multiple}
            onChange={(e) => {
                if(multiple) {
                    onChange(updateValue(storeKeys, List([...e.target.options].filter(o => o.selected).map(o => o.value))))
                } else {
                    onChange(updateValue(storeKeys, e.target.value));
                }
            }}>
            {enum_val ? enum_val.map((enum_name) => {
                const s = enum_name + '';
                const Translated = t(s, Map({relative: List(['enum', s])}), schema.get('t'));

                return <option
                    key={enum_name}
                    value={enum_name}
                    defaultValue={multiple ? currentValue.toArray().includes(enum_name) : currentValue === enum_name}>
                    {typeof Translated === 'string' || typeof Translated === 'number' ?
                        Translated :
                        beautifyKey(s)}
                </option>

            }).valueSeq() : null}
        </select>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>
};


const SelectMulti = extractValue(memo((props) => {
    return <Select {...props} multiple/>;
}));

export {Select, SelectMulti};
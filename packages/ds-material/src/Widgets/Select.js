import React from "react";
import {
    FormControl, Checkbox, InputLabel,
    MenuItem, Select as MuiSelect, ListItemText,
} from "@material-ui/core";
import {beautifyKey} from "@ui-schema/ui-schema";
import {List} from "immutable";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const Select = ({
                    multiple,
                    storeKeys, ownKey, schema, value, onChange,
                    showValidity, valid, required, errors
                }) => {
    if(!schema) return null;

    const enum_val = schema.get('enum');
    if(!enum_val) return null;

    let currentValue = undefined;
    if(multiple) {
        currentValue = typeof value !== 'undefined' ? value : (List(schema.get('default')) || List());
    } else {
        currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '');
    }

    return <FormControl required={required} error={!valid && showValidity} fullWidth>
        <InputLabel id={"demo-simple-select-label" + ownKey}>{beautifyKey(ownKey)}</InputLabel>
        <MuiSelect
            labelId={"demo-simple-select-label" + ownKey}
            id={"demo-simple-select" + ownKey}
            value={multiple ? currentValue.toArray() : currentValue}
            multiple={multiple}
            renderValue={selected => multiple ?
                selected.map(
                    s => typeof s === 'string' ?
                        beautifyKey(s) :
                        s + '')
                    .join(', ') :
                beautifyKey(selected)}
            onChange={(e) => multiple ?
                onChange(store => store.setIn(storeKeys, List(e.target.value))) :
                onChange(store => store.setIn(storeKeys, e.target.value))}
        >
            {enum_val ? enum_val.map((enum_name, i) =>
                <MenuItem
                    key={enum_name + '-' + i}
                    value={enum_name}
                >{multiple ?
                    <React.Fragment>
                        <Checkbox checked={currentValue.contains(enum_name)}/>
                        <ListItemText primary={<span>{beautifyKey(enum_name)}</span>}/>
                    </React.Fragment>
                    : beautifyKey(enum_name)}
                </MenuItem>
            ).valueSeq() : null}
        </MuiSelect>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>;
};

const SelectMulti = (props) => {
    return <Select {...props} multiple/>;
};

export {Select, SelectMulti};

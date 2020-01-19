import React from "react";
import {
    FormControl, FormHelperText, Checkbox, InputLabel,
    MenuItem, Select as MuiSelect, ListItemText,
} from "@material-ui/core";
import {beautifyKey, defaultSetter} from "@ui-schema/ui-schema/src";
import {List} from "immutable";

const Select = ({
                    multiple,
                    lastKey, required, schema, value, setData, storeKeys
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

    React.useEffect(() => {
        defaultSetter(value, schema, setData, storeKeys, false);
    }, [value, setData, storeKeys, schema]);

    return <FormControl required={required.contains(lastKey)} error={false}>
        <InputLabel id={"demo-simple-select-label" + lastKey}>{beautifyKey(lastKey)}</InputLabel>
        <MuiSelect
            labelId={"demo-simple-select-label" + lastKey}
            id={"demo-simple-select" + lastKey}
            value={multiple ? currentValue.toArray() : currentValue}
            multiple={multiple}
            renderValue={selected => multiple ?
                selected.map(s => beautifyKey(s)).join(', ') :
                beautifyKey(selected)}
            onChange={(e) => multiple ?
                setData(storeKeys, List(e.target.value)) :
                setData(storeKeys, e.target.value)}
        >
            {enum_val ? enum_val.map((enum_name) =>
                <MenuItem
                    key={enum_name}
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
        <FormHelperText>Some important helper text</FormHelperText>
    </FormControl>;
};

const SelectMulti = (props) => {
    return <Select {...props} multiple/>;
};

export {Select, SelectMulti};

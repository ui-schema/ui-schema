import React from "react";
import {
    FormControl, FormLabel, FormHelperText, FormGroup, FormControlLabel,
    Switch, Checkbox, RadioGroup, Radio,
} from "@material-ui/core";
import {beautifyKey, defaultSetter} from "@ui-schema/ui-schema";
import {useId} from "react-id-generator";

const BoolRenderer = ({lastKey, schema, value, setData, storeKeys}) => {

    React.useEffect(() => {
        defaultSetter(value, schema, setData, storeKeys, false);
    }, [value, setData, storeKeys, schema]);

    const currentVal = typeof value !== 'undefined' ? value : (schema.get('default') || false);

    return <FormControlLabel
        control={
            <Switch
                checked={currentVal}
                onChange={() => setData(storeKeys, !currentVal)}
            />
        }
        label={beautifyKey(lastKey)}
    />;
};

const OptionCheck = ({currentValue, onChange, label}) => {
    const formId = useId(1, 'ids-')[0];

    return <FormControlLabel
        id={formId}
        control={<Checkbox
            id={formId}
            value={currentValue}
            checked={currentValue}
            onChange={onChange}
        />}
        label={label}
    />;
};

const OptionsCheck = ({lastKey, required, schema, value, setData, storeKeys}) => {
    const enum_val = schema.get('enum');
    if(!enum_val) return null;

    React.useEffect(() => {
        defaultSetter(value, schema, setData, storeKeys, false);
    }, [value, setData, storeKeys, schema]);

    return <FormControl required={required.contains(lastKey)} error={false} component="fieldset">
        <FormLabel component="legend">{beautifyKey(lastKey)}</FormLabel>
        <FormGroup>
            {enum_val ? enum_val.map((enum_name) => {
                const currentValue = value && value.contains && typeof value.contains(enum_name) !== 'undefined' ? value.contains(enum_name) : false;

                return <OptionCheck
                    key={enum_name}
                    currentValue={currentValue}
                    onChange={() => {
                        if(currentValue) {
                            setData(storeKeys, value.delete(value.indexOf(enum_name)));
                        } else {
                            setData(storeKeys, value.push(enum_name));
                        }
                    }}
                    label={beautifyKey(enum_name)}
                />
            }).valueSeq() : null}
        </FormGroup>
        <FormHelperText>You can display an error</FormHelperText>
    </FormControl>;
};

const OptionsRadio = ({lastKey, required, schema, value, setData, storeKeys}) => {
    const enum_val = schema.get('enum');
    if(!enum_val) return null;

    const currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '');
    React.useEffect(() => {
        defaultSetter(value, schema, setData, storeKeys, false);
    }, [value, setData, storeKeys, schema]);

    return <FormControl required={required.contains(lastKey)} error={false} component="fieldset">
        <FormLabel component="legend">{beautifyKey(lastKey)}</FormLabel>
        <RadioGroup>
            {enum_val ? enum_val.map((enum_name) => {
                return <FormControlLabel
                    key={enum_name}
                    control={<Radio
                        value={enum_name}
                        checked={enum_name === currentValue}
                        onChange={() => setData(storeKeys, enum_name)}
                    />}
                    label={beautifyKey(enum_name)}
                />
            }).valueSeq() : null}
        </RadioGroup>
        <FormHelperText>You can display an error</FormHelperText>
    </FormControl>
};

export {OptionsRadio, OptionsCheck, BoolRenderer};

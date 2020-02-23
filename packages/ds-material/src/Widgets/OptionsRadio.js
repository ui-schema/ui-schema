import React from "react";
import {
    FormControl, FormLabel, FormControlLabel, RadioGroup, Radio,
} from "@material-ui/core";
import {beautifyKey, updateValue,} from "@ui-schema/ui-schema";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const OptionsRadio = ({ownKey, schema, value, onChange, storeKeys, showValidity, valid, required, errors}) => {
    const enumVal = schema.get('enum');
    if(!enumVal) return null;

    const currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '');

    return <FormControl required={required} error={!valid && showValidity} component="fieldset">
        <FormLabel component="legend">{beautifyKey(ownKey)}</FormLabel>
        <RadioGroup>
            {enumVal ? enumVal.map((enum_name) => {
                return <FormControlLabel
                    key={enum_name}
                    control={<Radio
                        value={enum_name}
                        checked={enum_name === currentValue}
                        onChange={() => onChange(updateValue(storeKeys, enum_name))}
                    />}
                    label={beautifyKey(enum_name)}
                />
            }).valueSeq() : null}
        </RadioGroup>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>
};

export {OptionsRadio,};

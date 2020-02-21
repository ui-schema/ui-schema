import React from "react";
import {
    FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox,
} from "@material-ui/core";
import {List} from "immutable";
import {beautifyKey, extractValue, memo, updateValue,} from "@ui-schema/ui-schema";
import {useId} from "react-id-generator";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const OptionCheck = ({currentValue, label, onChange}) => {
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

const OptionsCheckValue = extractValue(memo(({enumVal, storeKeys, value, onChange}) => enumVal ?
    enumVal.map((enum_name) => {
        const currentValue = value && value.contains && typeof value.contains(enum_name) !== 'undefined' ? value.contains(enum_name) : false;

        return <OptionCheck
            key={enum_name}
            currentValue={currentValue}
            onChange={() => {
                if(currentValue) {
                    onChange(updateValue(storeKeys, value.delete(value.indexOf(enum_name))));
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

const OptionsCheck = ({ownKey, schema, storeKeys, showValidity, valid, required, errors}) => {
    const enumVal = schema.get('enum');
    if(!enumVal) return null;

    return <FormControl required={required} error={!valid && showValidity} component="fieldset">
        <FormLabel component="legend">{beautifyKey(ownKey)}</FormLabel>
        <FormGroup>
            <OptionsCheckValue enumVal={enumVal} storeKeys={storeKeys}/>
        </FormGroup>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>;
};

export {OptionsCheck};

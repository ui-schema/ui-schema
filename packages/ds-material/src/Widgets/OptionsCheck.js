import React from "react";
import {
    FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox,
} from "@material-ui/core";
import {List} from "immutable";
import {Trans, beautifyKey, extractValue, memo, updateValue,} from "@ui-schema/ui-schema";
import {useUID} from "react-uid";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const OptionCheck = ({currentValue, label, onChange}) => {
    const uid = useUID();

    return <FormControlLabel
        id={'uis-' + uid}
        control={<Checkbox
            id={'uis-' + uid}
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
            label={<Trans text={storeKeys.insert(0, 'widget').push('enum').push(enum_name).join('.')} fallback={beautifyKey(enum_name)}/>}
        />
    }).valueSeq()
    : null
));

const OptionsCheck = ({
                          ownKey, schema, storeKeys, showValidity, valid, required, errors,
                          row
                      }) => {
    const enumVal = schema.get('enum');
    if(!enumVal) return null;

    return <FormControl required={required} error={!valid && showValidity} component="fieldset">
        <FormLabel component="legend"><Trans text={storeKeys.insert(0, 'widget').push('title').join('.')} fallback={beautifyKey(ownKey, schema.get('tt'))}/></FormLabel>
        <FormGroup row={row}>
            <OptionsCheckValue enumVal={enumVal} storeKeys={storeKeys}/>
        </FormGroup>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>;
};

export {OptionsCheck};

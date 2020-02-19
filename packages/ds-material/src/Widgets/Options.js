import React from "react";
import {
    FormControl, FormLabel, FormGroup, FormControlLabel,
    Switch, Checkbox, RadioGroup, Radio, makeStyles
} from "@material-ui/core";
import {grey} from "@material-ui/core/colors";
import {List} from "immutable";
import {beautifyKey,} from "@ui-schema/ui-schema";
import {useId} from "react-id-generator";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const switchStyle = makeStyles(theme => ({
    switchBase: {
        color: ({error}) => error ? theme.palette.error.main : (theme.palette.type === 'dark' ? grey[400] : grey[50]),
    },
    checked: {},
    track: {
        backgroundColor: ({error}) => error ? theme.palette.error.dark : (theme.palette.type === 'dark' ? grey[500] : grey[300]),
    },
}));

const BoolRenderer = ({ownKey, value, onChange, storeKeys, showValidity, valid, required}) => {
    const currentVal = !!value;

    const classes = switchStyle({error: !valid && showValidity});

    return <FormControlLabel
        control={
            <Switch
                classes={classes}
                required={required}
                checked={currentVal}
                onChange={() => onChange(store => store.setIn(storeKeys, !currentVal))}
            />
        }
        label={beautifyKey(ownKey) + (required ? ' *' : '')}
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

const OptionsCheck = ({ownKey, schema, value, onChange, storeKeys, showValidity, valid, required, errors}) => {
    const enum_val = schema.get('enum');
    if(!enum_val) return null;

    return <FormControl required={required} error={!valid && showValidity} component="fieldset">
        <FormLabel component="legend">{beautifyKey(ownKey)}</FormLabel>
        <FormGroup>
            {enum_val ? enum_val.map((enum_name) => {
                const currentValue = value && value.contains && typeof value.contains(enum_name) !== 'undefined' ? value.contains(enum_name) : false;

                return <OptionCheck
                    key={enum_name}
                    currentValue={currentValue}
                    onChange={() => {
                        if(currentValue) {
                            onChange(store => store.setIn(storeKeys, value.delete(value.indexOf(enum_name))));
                        } else {
                            onChange(store => store.setIn(
                                storeKeys,
                                value ? value.push(enum_name) : List([]).push(enum_name))
                            );
                        }
                    }}
                    label={beautifyKey(enum_name)}
                />
            }).valueSeq() : null}
        </FormGroup>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>;
};

const OptionsRadio = ({ownKey, schema, value, onChange, storeKeys, showValidity, valid, required, errors}) => {
    const enum_val = schema.get('enum');
    if(!enum_val) return null;

    const currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '');

    return <FormControl required={required} error={!valid && showValidity} component="fieldset">
        <FormLabel component="legend">{beautifyKey(ownKey)}</FormLabel>
        <RadioGroup>
            {enum_val ? enum_val.map((enum_name) => {
                return <FormControlLabel
                    key={enum_name}
                    control={<Radio
                        value={enum_name}
                        checked={enum_name === currentValue}
                        onChange={() => onChange(store => store.setIn(storeKeys, enum_name))}
                    />}
                    label={beautifyKey(enum_name)}
                />
            }).valueSeq() : null}
        </RadioGroup>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>
};

export {OptionsRadio, OptionsCheck, BoolRenderer};

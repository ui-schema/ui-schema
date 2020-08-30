import React from "react";
import {
    FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox,
} from "@material-ui/core";
import {Map, List} from "immutable";
import {TransTitle, Trans, beautifyKey, extractValue, memo, updateValue,} from "@ui-schema/ui-schema";
import {useUID} from "react-uid";
import {ValidityHelperText} from "../../Component/LocaleHelperText/LocaleHelperText";

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

const OptionsCheckValue = extractValue(memo(({
                                                 enumVal, storeKeys, value, onChange, trans,
                                                 required, type,
                                             }) =>
    enumVal ?
        enumVal.map((enum_name) => {
            const isActive = value && value.contains && typeof value.contains(enum_name) !== 'undefined' ? value.contains(enum_name) : false;

            const relativeT = List(['enum', enum_name]);

            return <OptionCheck
                key={enum_name}
                currentValue={isActive}
                onChange={() => {
                    if(isActive) {
                        onChange(updateValue(storeKeys, value.delete(value.indexOf(enum_name)), required, type));
                    } else {
                        onChange(updateValue(
                            storeKeys,
                            value ? value.push(enum_name) : List([]).push(enum_name),
                            required,
                            type,
                        ));
                    }
                }}
                label={<Trans
                    schema={trans}
                    text={storeKeys.insert(0, 'widget').concat(relativeT).join('.')}
                    context={Map({'relative': relativeT})}
                    fallback={beautifyKey(enum_name)}
                />}
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
        <FormLabel component="legend">
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
        </FormLabel>
        <FormGroup row={row}>
            <OptionsCheckValue enumVal={enumVal} storeKeys={storeKeys} trans={schema.get('t')} required={required} type={schema.get('type')}/>
        </FormGroup>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>;
};

export {OptionsCheck};

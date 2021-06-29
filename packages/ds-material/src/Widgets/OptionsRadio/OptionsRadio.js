import React from 'react';
import {Map, List} from 'immutable';
import {
    FormControl, FormLabel, FormControlLabel, RadioGroup, Radio,
} from '@material-ui/core';
import {TransTitle, Trans, beautifyKey} from '@ui-schema/ui-schema';
import {ValidityHelperText} from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText';

const OptionsRadio = ({
                          ownKey, schema, value, onChange, storeKeys, showValidity, valid, required, errors,
                          row,
                      }) => {
    const enumVal = schema.get('enum');
    if(!enumVal) return null;

    const isActive = typeof value !== 'undefined' ? value : (schema.get('default') || '');

    return <FormControl required={required} error={!valid && showValidity} component="fieldset">
        <FormLabel component="legend"><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/></FormLabel>
        <RadioGroup row={row}>
            {enumVal ? enumVal.map((enum_name) => {
                return <FormControlLabel
                    key={enum_name}
                    control={<Radio
                        value={enum_name}
                        checked={enum_name === isActive}
                        onChange={() =>
                            !schema.get('readOnly') &&
                            onChange(
                                storeKeys, ['value'],
                                () => ({value: enum_name}),
                                schema.get('deleteOnEmpty') || required,
                                schema.get('type'),
                            )
                        }
                    />}
                    label={<Trans
                        schema={schema.get('t')}
                        text={storeKeys.insert(0, 'widget').concat(List(['enum', enum_name])).join('.')}
                        context={Map({'relative': List(['enum', enum_name])})}
                        fallback={beautifyKey(enum_name, schema.get('ttEnum'))}
                    />}
                />
            }).valueSeq() : null}
        </RadioGroup>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>
};

export {OptionsRadio};

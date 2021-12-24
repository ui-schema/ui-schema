import React from 'react';
import {Map, List} from 'immutable';
import {useUID} from 'react-uid';
import {
    FormControl, Checkbox, InputLabel,
    MenuItem, Select as MuiSelect, ListItemText,
} from '@material-ui/core';
import {TransTitle, Trans, beautifyKey, extractValue, memo} from '@ui-schema/ui-schema';
import {ValidityHelperText} from '@ui-schema/ds-material/Component/LocaleHelperText';
import {sortScalarList} from '@ui-schema/ui-schema/Utils/sortScalarList';
import {getTranslatableEnum} from '@ui-schema/ui-schema/Translate';

const Select = ({
                    multiple,
                    storeKeys, ownKey, schema, value, onChange,
                    showValidity, valid, required, errors, t,
                }) => {
    const uid = useUID();
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
        <InputLabel id={'uis-' + uid}><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/></InputLabel>
        <MuiSelect
            labelId={'uis-' + uid}
            id={'uis-' + uid + '-label'}
            value={multiple ? currentValue.toArray() : currentValue}
            multiple={multiple}
            renderValue={selected => {
                const sel = multiple ? selected : [selected];
                return sel.map(s => {
                    s = s + '';
                    const Translated = t(s, Map({relative: List(['enum', s])}), schema.get('t'));
                    return typeof Translated === 'string' || typeof Translated === 'number' ?
                        Translated :
                        beautifyKey(s, schema.get('ttEnum')) + '';
                }).join(', ')
            }}
            onChange={(e) =>
                !schema.get('readOnly') &&
                onChange(
                    storeKeys, ['value'],
                    {
                        type: 'update',
                        updater: () => ({
                            value: multiple ?
                                sortScalarList(List(e.target.value)) :
                                e.target.value,
                        }),
                        schema,
                        required,
                    },
                )
            }
        >
            {enum_val ? enum_val.map((enum_name, i) =>
                <MenuItem
                    key={enum_name + '-' + i}
                    value={enum_name}
                    dense={schema.getIn(['view', 'dense'])}
                >{multiple ?
                    <React.Fragment>
                        <Checkbox checked={currentValue.contains(enum_name)}/>
                        <ListItemText primary={<Trans
                            schema={schema.get('t')}
                            text={storeKeys.insert(0, 'widget').concat(List(['enum', getTranslatableEnum(enum_name)])).join('.')}
                            context={Map({'relative': List(['enum', getTranslatableEnum(enum_name)])})}
                            fallback={beautifyKey(getTranslatableEnum(enum_name), schema.get('ttEnum')) + ''}
                        />}/>
                    </React.Fragment> :
                    <Trans
                        schema={schema.get('t')}
                        text={storeKeys.insert(0, 'widget').concat(List(['enum', getTranslatableEnum(enum_name)])).join('.')}
                        context={Map({'relative': List(['enum', getTranslatableEnum(enum_name)])})}
                        fallback={beautifyKey(getTranslatableEnum(enum_name), schema.get('ttEnum')) + ''}
                    />}
                </MenuItem>,
            ).valueSeq() : null}
        </MuiSelect>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>;
};

const SelectMulti = extractValue(memo((props) => {
    return <Select {...props} multiple/>;
}));

export {Select, SelectMulti};

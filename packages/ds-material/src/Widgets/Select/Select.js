import React from 'react';
import {Map, List} from 'immutable';
import {
    FormControl, Checkbox, InputLabel,
    MenuItem, Select as MuiSelect, ListItemText,
} from '@material-ui/core';
import {TransTitle, Trans, beautifyKey, updateValue, extractValue, memo} from '@ui-schema/ui-schema';
import {ValidityHelperText} from '../../Component/LocaleHelperText/LocaleHelperText';

const Select = ({
                    multiple,
                    storeKeys, ownKey, schema, value, onChange,
                    showValidity, valid, required, errors, t,
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
        <InputLabel id={'demo-simple-select-label' + ownKey}><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/></InputLabel>
        <MuiSelect
            labelId={'demo-simple-select-label' + ownKey}
            id={'demo-simple-select' + ownKey}
            value={multiple ? currentValue.toArray() : currentValue}
            multiple={multiple}
            renderValue={selected => {
                const sel = multiple ? selected : [selected];
                return sel.map(s => {
                    s = s + '';
                    const Translated = t(s, Map({relative: List(['enum', s])}), schema.get('t'));
                    return typeof Translated === 'string' || typeof Translated === 'number' ?
                        Translated :
                        beautifyKey(s, schema.get('tt')) + '';
                }).join(', ')
            }}
            onChange={(e) => multiple ?
                onChange(updateValue(storeKeys, List(e.target.value), schema.get('deleteOnEmpty') || required, schema.get('type'))) :
                onChange(updateValue(storeKeys, e.target.value, schema.get('deleteOnEmpty') || required, schema.get('type')))}
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
                            text={storeKeys.insert(0, 'widget').concat(List(['enum', enum_name])).join('.')}
                            context={Map({'relative': List(['enum', enum_name])})}
                            fallback={beautifyKey(enum_name, schema.get('tt')) + ''}
                        />}/>
                    </React.Fragment>
                    : <Trans
                        schema={schema.get('t')}
                        text={storeKeys.insert(0, 'widget').concat(List(['enum', enum_name])).join('.')}
                        context={Map({'relative': List(['enum', enum_name])})}
                        fallback={beautifyKey(enum_name, schema.get('tt')) + ''}
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

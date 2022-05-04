import React from 'react';
import {TransTitle, useUIMeta, beautifyKey} from '@ui-schema/ui-schema';
import {List, Map} from 'immutable';
import {ValidityHelperText} from '../../Component/LocaleHelperText/LocaleHelperText';

export const Select = ({schema, storeKeys, showValidity, errors, value, onChange, required}) => {
    const enum_val = schema.get('enum');
    const {t} = useUIMeta();

    if(!enum_val) return null;
    if(!schema) return null;

    let classForm = ['selectpicker', 'custom-select'];
    let classFormParent = ['form-group'];
    if(showValidity && errors.hasError()) {
        classForm.push('is-invalid');
    }
    if(showValidity && !errors.hasError()) {
        classForm.push('was-validated');
    }
    const currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '');
    return <div className={classFormParent.join(' ')}>
        <label><TransTitle schema={schema} storeKeys={storeKeys}/></label>
        <select
            value={currentValue}
            className={classForm.join(' ')}
            onChange={(e) => {
                const target = e.target
                onChange({
                    storeKeys,
                    scopes: ['value'],
                    type: 'update',
                    updater: () => ({
                        value: target.value,
                    }),
                    schema,
                    required,
                })
            }}>
            {enum_val ? enum_val.map((enum_name) => {
                const s = enum_name + '';
                const Translated = t(s, Map({relative: List(['enum', s])}), schema.get('t'));

                return <option
                    key={enum_name}
                    value={enum_name}
                    defaultValue={currentValue === enum_name}>
                    {typeof Translated === 'string' || typeof Translated === 'number' ?
                        Translated :
                        beautifyKey(s, schema.get('ttEnum'))}
                </option>

            }).valueSeq() : null}
        </select>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>
};

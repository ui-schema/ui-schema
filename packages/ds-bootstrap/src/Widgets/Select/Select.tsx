import { WithScalarValue } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widgets'
import React from 'react'
import { beautifyKey } from '@ui-schema/system/Utils/beautify'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { useUIMeta } from '@ui-schema/react/UIMeta'
import { List, Map } from 'immutable'
import { ValidityHelperText } from '@ui-schema/ds-bootstrap/Component/LocaleHelperText'

export const Select = ({schema, storeKeys, showValidity, errors, value, onChange, required}: WidgetProps & WithScalarValue) => {
    const enum_val = schema.get('enum')
    const {t} = useUIMeta()

    if (!enum_val) return null
    if (!schema) return null

    const classForm = ['selectpicker', 'custom-select']
    const classFormParent = ['form-group']
    if (showValidity && errors?.size) {
        classForm.push('is-invalid')
    }
    if (showValidity && !errors?.size) {
        classForm.push('was-validated')
    }
    const currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '')
    return <div className={classFormParent.join(' ')}>
        <label><TranslateTitle schema={schema} storeKeys={storeKeys}/></label>
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
                const s = enum_name + ''
                const Translated = t(s, Map({relative: List(['enum', s])}), schema.get('t'))

                return <option
                    key={enum_name}
                    value={enum_name}
                    selected={currentValue === enum_name}
                    // defaultValue={currentValue === enum_name}
                >
                    {typeof Translated === 'string' || typeof Translated === 'number' ?
                        Translated :
                        beautifyKey(s, schema.get('ttEnum'))}
                </option>

            }).valueSeq() : null}
        </select>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>
}

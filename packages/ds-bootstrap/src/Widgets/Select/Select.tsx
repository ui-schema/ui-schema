import { WithOnChange, WithValuePlain } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widget'
import { beautifyKey } from '@ui-schema/ui-schema/Utils/beautify'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { useUIMeta } from '@ui-schema/react/UIMeta'
import { List, Map } from 'immutable'
import { ValidityHelperText } from '@ui-schema/ds-bootstrap/Component/LocaleHelperText'
import * as React from 'react'

export const Select = ({schema, storeKeys, showValidity, keysToName, errors, value, onChange, required}: WidgetProps & WithValuePlain & WithOnChange) => {
    const uid = React.useId()
    const enum_val = schema.get('enum')
    const {t} = useUIMeta()

    if (!enum_val) return null
    if (!schema) return null

    const classForm = ['form-select']
    const classFormParent = ['']
    if (showValidity && errors?.size) {
        classForm.push('is-invalid')
    }
    if (showValidity && !errors?.size) {
        classForm.push('was-validated')
    }
    const currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '')
    return <div className={classFormParent.join(' ')}>
        <label className={'form-label'} htmlFor={'uis-' + uid}><TranslateTitle schema={schema} storeKeys={storeKeys}/></label>
        <select
            id={'uis-' + uid}
            value={currentValue}
            className={classForm.join(' ')}
            name={keysToName?.(storeKeys)}
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
                    // selected={currentValue === enum_name}
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

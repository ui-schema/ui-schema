import React from 'react'
import { Map, List } from 'immutable'
import { useUID } from 'react-uid'
import {
    FormControl, InputLabel,
    MenuItem, Select as MuiSelect,
} from '@material-ui/core'
import { TransTitle, Trans, beautifyKey, WidgetProps, tt, StoreSchemaType, WithScalarValue } from '@ui-schema/ui-schema'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { getTranslatableEnum } from '@ui-schema/ui-schema/Translate'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'

export const Select: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithScalarValue> = (
    {
        storeKeys, ownKey, schema, value, onChange,
        showValidity, valid, required, errors, t,
    }
) => {
    const uid = useUID()
    if (!schema) return null

    const enum_val = schema.get('enum')
    if (!enum_val) return null

    const currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '')

    return <FormControl required={required} error={!valid && showValidity} fullWidth>
        <InputLabel id={'uis-' + uid}><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/></InputLabel>
        <MuiSelect
            labelId={'uis-' + uid}
            id={'uis-' + uid + '-label'}
            value={currentValue}
            renderValue={selected => {
                const Translated = t(selected as string, Map({relative: List(['enum', selected as string | number])}), schema.get('t') as StoreSchemaType)
                return typeof Translated === 'string' || typeof Translated === 'number' ?
                    Translated :
                    beautifyKey(selected as string, schema.get('ttEnum') as tt) + ''
            }}
            onChange={(e) =>
                !schema.get('readOnly') &&
                onChange({
                    storeKeys,
                    scopes: ['value'],
                    type: 'set',
                    schema,
                    required,
                    data: {
                        value: e.target.value,
                    },
                })
            }
        >
            {enum_val ? (enum_val as List<string | number>).map((enum_name, i) =>
                <MenuItem
                    key={enum_name + '-' + i}
                    value={enum_name as string | number}
                    dense={schema.getIn(['view', 'dense']) as boolean}
                >
                    <Trans
                        schema={schema.get('t') as StoreSchemaType}
                        text={storeKeys.insert(0, 'widget').concat(List(['enum', getTranslatableEnum(enum_name)])).join('.')}
                        context={Map({'relative': List(['enum', getTranslatableEnum(enum_name)])})}
                        fallback={beautifyKey(getTranslatableEnum(enum_name), schema.get('ttEnum') as tt) + ''}
                    />
                </MenuItem>,
            ).valueSeq() : null}
        </MuiSelect>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>
}

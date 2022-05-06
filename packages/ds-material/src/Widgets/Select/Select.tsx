import React from 'react'
import { Map, List } from 'immutable'
import { useUID } from 'react-uid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select'
import { WithScalarValue } from '@ui-schema/ui-schema/UIStore'
import { TransTitle, Trans } from '@ui-schema/ui-schema/Translate'
import { beautifyKey, tt } from '@ui-schema/ui-schema/Utils/beautify'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { getTranslatableEnum } from '@ui-schema/ui-schema/Translate'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'

export interface SelectProps {
    variant?: MuiSelectProps['variant']
}

export const Select: React.FC<WidgetProps<MuiWidgetBinding> & WithScalarValue & SelectProps> = (
    {
        storeKeys, schema, value, onChange,
        showValidity, valid, required, errors, t,
        variant,
    }
) => {
    const uid = useUID()
    if (!schema) return null

    const enum_val = schema.get('enum')
    if (!enum_val) return null

    const currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '')

    return <FormControl
        required={required} error={!valid && showValidity} fullWidth
        size={schema.getIn(['view', 'dense']) ? 'small' : undefined}
        disabled={schema.get('readOnly') as boolean}
        variant={variant}
    >
        <InputLabel id={'uis-' + uid + '-label'}><TransTitle schema={schema} storeKeys={storeKeys}/></InputLabel>
        <MuiSelect
            labelId={'uis-' + uid + '-label'}
            id={'uis-' + uid}
            value={currentValue}
            variant={variant}
            // note: for variant `outlined` the label needs to be also here, as we don't know e.g. theme provider overrides, it is applied all the time
            label={<TransTitle schema={schema} storeKeys={storeKeys}/>}
            renderValue={selected => {
                const Translated = t(selected as string, Map({relative: List(['enum', selected as string | number])}), schema.get('t') as StoreSchemaType)
                return typeof Translated === 'string' || typeof Translated === 'number' ?
                    Translated :
                    beautifyKey(selected as string, schema.get('ttEnum') as tt) + ''
            }}
            disabled={schema.get('readOnly') as boolean}
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
                    dense={schema.getIn(['view', 'denseOptions']) as boolean}
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

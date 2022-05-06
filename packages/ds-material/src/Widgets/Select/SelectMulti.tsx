import React from 'react'
import { Map, List, OrderedMap } from 'immutable'
import { useUID } from 'react-uid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import { extractValue, WithValue } from '@ui-schema/ui-schema/UIStore'
import { TransTitle, Trans } from '@ui-schema/ui-schema/Translate'
import { beautifyKey, tt } from '@ui-schema/ui-schema/Utils/beautify'
import { memo } from '@ui-schema/ui-schema/Utils/memo'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'
import { sortScalarList } from '@ui-schema/ui-schema/Utils/sortScalarList'

export interface SelectMultiProps {
    variant?: MuiSelectProps['variant']
}

export const SelectMultiBase: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithValue & SelectMultiProps> = (
    {
        storeKeys, schema, value, onChange,
        showValidity, valid, required, errors, t,
        variant,
    }
) => {
    const uid = useUID()
    if (!schema) return null

    const oneOfValues = schema.getIn(['items', 'oneOf']) as List<OrderedMap<string, any>>
    if (!oneOfValues) return null

    const currentValue = typeof value !== 'undefined' ? value :
        schema.get('default') ? List(schema.get('default') as string[]) : List()

    return <FormControl
        required={required} error={!valid && showValidity} fullWidth
        disabled={schema.get('readOnly') as boolean}
        size={schema.getIn(['view', 'dense']) ? 'small' : undefined}
        variant={variant}
    >
        <InputLabel id={'uis-' + uid + '-label'}><TransTitle schema={schema} storeKeys={storeKeys}/></InputLabel>
        <MuiSelect
            labelId={'uis-' + uid + '-label'}
            id={'uis-' + uid}
            variant={variant}
            // note: for variant `outlined` the label needs to be also here, as we don't know e.g. theme provider overrides, it is applied all the time
            label={<TransTitle schema={schema} storeKeys={storeKeys}/>}
            value={currentValue.toArray()}
            multiple
            renderValue={selected => {
                const sel = selected as string[]
                return sel.map(s => {
                    s = s + ''
                    const oneOfValue = oneOfValues.find(oof => oof.get('const') === s)
                    const Translated = t(s, Map({relative: List(['title'])}), oneOfValue?.get('t') as StoreSchemaType)
                    return typeof Translated === 'string' || typeof Translated === 'number' ?
                        Translated :
                        beautifyKey(s, oneOfValue?.get('tt') as tt) + ''
                }).join(', ')
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
                        value: sortScalarList(List(e.target.value as any[])),
                    },
                })
            }
        >
            {oneOfValues ? oneOfValues.map((oneOfSchema, i) =>
                <MenuItem
                    key={oneOfSchema.get('const') + '-' + i}
                    value={oneOfSchema.get('const') as string}
                    dense={schema.getIn(['view', 'denseOptions']) as boolean}
                    disabled={oneOfSchema.get('readOnly') as boolean}
                >
                    <Checkbox checked={currentValue.contains(oneOfSchema.get('const'))}/>
                    <ListItemText primary={<Trans
                        schema={oneOfSchema.get('t') as unknown as StoreSchemaType}
                        text={oneOfSchema.get('title') || oneOfSchema.get('const') as string | number}
                        context={Map({'relative': List(['title'])})}
                        fallback={oneOfSchema.get('title') || beautifyKey(oneOfSchema.get('const') as string | number, oneOfSchema.get('tt') as tt)}
                    />}/>
                </MenuItem>,
            ).valueSeq() : null}
        </MuiSelect>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>
}

export const SelectMulti = extractValue(memo(SelectMultiBase)) as React.ComponentType<WidgetProps<MuiWidgetBinding>>


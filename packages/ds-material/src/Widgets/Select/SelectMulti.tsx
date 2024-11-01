import React from 'react'
import { List } from 'immutable'
import { useUID } from 'react-uid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import { extractValue, WithValue } from '@ui-schema/ui-schema/UIStore'
import { TransTitle, Trans } from '@ui-schema/ui-schema/Translate'
import { memo } from '@ui-schema/ui-schema/Utils/memo'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'
import { sortScalarList } from '@ui-schema/ui-schema/Utils/sortScalarList'
import { useOptionsFromSchema } from '@ui-schema/ds-material/Utils'

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
    const {valueSchemas} = useOptionsFromSchema(storeKeys, schema.get('items') as StoreSchemaType)

    const currentValue = typeof value !== 'undefined' ? value :
        schema.get('default') ? List(schema.get('default') as string[]) : List()
    const denseOptions = schema.getIn(['view', 'denseOptions']) as boolean
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
                    const valueSchema = valueSchemas?.find(oof => oof.value === s)
                    const Translated = t(s, valueSchema?.context, valueSchema?.schema?.get('t') as StoreSchemaType)
                    return typeof Translated === 'string' || typeof Translated === 'number' ?
                        Translated :
                        valueSchema?.fallback
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
            {valueSchemas?.map(({value, text, fallback, context, schema}, i) =>
                <MenuItem
                    key={value + '-' + i}
                    value={value as string}
                    dense={denseOptions}
                    disabled={schema?.get('readOnly') as boolean}
                >
                    <Checkbox checked={currentValue.contains(value)}/>
                    <ListItemText primary={<Trans
                        schema={schema?.get('t') as unknown as StoreSchemaType}
                        text={text}
                        context={context}
                        fallback={fallback}
                    />}/>
                </MenuItem>,
            ).valueSeq()}
        </MuiSelect>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>
}

export const SelectMulti = extractValue(memo(SelectMultiBase)) as React.ComponentType<WidgetProps<MuiWidgetBinding>>


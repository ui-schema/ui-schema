import { useUIMeta } from '@ui-schema/react/UIMeta'
import React from 'react'
import { List } from 'immutable'
import { useUID } from 'react-uid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import { extractValue } from '@ui-schema/react/UIStore'
import { Translate } from '@ui-schema/react/Translate'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { memo } from '@ui-schema/react/Utils/memo'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { sortScalarList } from '@ui-schema/ui-schema/Utils/sortScalarList'
import { useOptionsFromSchema } from '@ui-schema/ds-material/Utils'

export interface SelectMultiProps {
    variant?: MuiSelectProps['variant']
}

export const SelectMultiBase: React.ComponentType<WidgetProps & SelectMultiProps> = (
    {
        storeKeys, schema, value, onChange,
        showValidity, valid, required, errors,
        variant,
    },
) => {
    const uid = useUID()
    const {t} = useUIMeta()
    const {valueSchemas} = useOptionsFromSchema(storeKeys, schema.get('items') as UISchemaMap)

    const currentValue = typeof value !== 'undefined' ? value :
        schema.get('default') ? List(schema.get('default') as string[]) : List()
    const denseOptions = schema.getIn(['view', 'denseOptions']) as boolean
    return <FormControl
        required={required} error={!valid && showValidity} fullWidth
        disabled={schema.get('readOnly') as boolean}
        size={schema.getIn(['view', 'dense']) ? 'small' : undefined}
        variant={variant}
    >
        <InputLabel id={'uis-' + uid + '-label'}><TranslateTitle schema={schema} storeKeys={storeKeys}/></InputLabel>
        <MuiSelect
            labelId={'uis-' + uid + '-label'}
            id={'uis-' + uid}
            variant={variant}
            // note: for variant `outlined` the label needs to be also here, as we don't know e.g. theme provider overrides, it is applied all the time
            label={<TranslateTitle schema={schema} storeKeys={storeKeys}/>}
            value={List.isList(currentValue) ? currentValue.toArray() : Array.isArray(currentValue) ? currentValue : null}
            multiple
            renderValue={selected => {
                const sel = selected as string[]
                return sel.map(s => {
                    const valueSchema = valueSchemas?.find(oof => oof.value === s)
                    const Translated = t(s, valueSchema?.context, valueSchema?.schema?.get('t') as UISchemaMap)
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
                    <Checkbox checked={(List.isList(currentValue) && currentValue.contains(value)) || (Array.isArray(currentValue) && currentValue.includes(value))}/>
                    <ListItemText primary={<Translate
                        schema={schema?.get('t') as unknown as UISchemaMap}
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

export const SelectMulti = extractValue(memo(SelectMultiBase)) as (props: WidgetProps) => React.ReactElement

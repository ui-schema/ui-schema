import React from 'react'
import { useUID } from 'react-uid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select'
import { WithScalarValue } from '@ui-schema/ui-schema/UIStore'
import { TransTitle, Trans } from '@ui-schema/ui-schema/Translate'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'
import { useOptionsFromSchema } from '@ui-schema/ds-material/Utils'

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

    const {valueSchemas} = useOptionsFromSchema(storeKeys, schema)

    const currentValue = typeof value !== 'undefined' ? value : (schema?.get('default') || '')
    const denseOptions = schema.getIn(['view', 'denseOptions']) as boolean
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
                const valueSchema = valueSchemas?.find(oof => oof.value === selected)
                const Translated = t(selected, valueSchema?.context, valueSchema?.schema?.get('t') as StoreSchemaType)
                return typeof Translated === 'string' || typeof Translated === 'number' ?
                    Translated :
                    valueSchema?.fallback
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
            {valueSchemas?.map(({value, text, fallback, context, schema}, i) =>
                <MenuItem
                    key={value + '-' + i}
                    value={value as string | number}
                    dense={denseOptions}
                    disabled={schema?.get('readOnly') as boolean}
                >
                    <Trans
                        schema={schema?.get('t') as StoreSchemaType}
                        text={text}
                        context={context}
                        fallback={fallback}
                    />
                </MenuItem>,
            ).valueSeq()}
        </MuiSelect>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>
}

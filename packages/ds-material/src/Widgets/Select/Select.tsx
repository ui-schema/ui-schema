import { useUIMeta } from '@ui-schema/react/UIMeta'
import React from 'react'
import { useUID } from 'react-uid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select'
import { WithScalarValue } from '@ui-schema/react/UIStore'
import { Translate } from '@ui-schema/react/Translate'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { useOptionsFromSchema } from '@ui-schema/ds-material/Utils'

export type SelectProps = {
    variant?: MuiSelectProps['variant']
} & WidgetProps & WithScalarValue

export const Select = <P extends SelectProps>(
    {
        storeKeys, schema, value, onChange,
        showValidity, valid, required, errors,
        variant,
    }: P,
): React.ReactElement => {
    const {t} = useUIMeta()
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
        <InputLabel id={'uis-' + uid + '-label'}><TranslateTitle schema={schema} storeKeys={storeKeys}/></InputLabel>
        <MuiSelect
            labelId={'uis-' + uid + '-label'}
            id={'uis-' + uid}
            value={currentValue}
            variant={variant}
            // note: for variant `outlined` the label needs to be also here, as we don't know e.g. theme provider overrides, it is applied all the time
            label={<TranslateTitle schema={schema} storeKeys={storeKeys}/>}
            renderValue={selected => {
                const valueSchema = valueSchemas?.find(oof => oof.value === selected)
                const Translated = t(selected, valueSchema?.context, valueSchema?.schema?.get('t') as UISchemaMap)
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
                    <Translate
                        schema={schema?.get('t') as UISchemaMap}
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

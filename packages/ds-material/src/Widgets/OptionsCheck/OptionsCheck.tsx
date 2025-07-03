import { MuiBindingComponents } from '@ui-schema/ds-material'
import React from 'react'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { List } from 'immutable'
import { memo } from '@ui-schema/react/Utils/memo'
import { StoreKeys, extractValue, WithOnChange } from '@ui-schema/react/UIStore'
import { Translate } from '@ui-schema/react/Translate'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { useUID } from 'react-uid'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { sortScalarList } from '@ui-schema/ui-schema/Utils/sortScalarList'
import { SwitchBaseProps } from '@mui/material/internal/SwitchBase'
import { OptionValueSchema, useOptionsFromSchema } from '@ui-schema/ds-material/Utils'

const OptionCheck: React.ComponentType<{
    disabled?: boolean
    checked: boolean
    label: React.ReactNode
    onChange: SwitchBaseProps['onChange']
}> = ({disabled, checked, label, onChange}) => {
    const uid = useUID()

    return <FormControlLabel
        id={'uis-' + uid}
        control={<Checkbox
            id={'uis-' + uid}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
        />}
        disabled={disabled}
        label={label}
    />
}

const checkActive = (list: List<unknown>, name: string | undefined | number) => list && list.contains && typeof list.contains(name) !== 'undefined' ? list.contains(name) : false

const OptionsCheckValuesBase: React.ComponentType<{
    storeKeys: StoreKeys
    required?: boolean
    valueSchemas?: List<OptionValueSchema>
    schema: UISchemaMap
    disabled?: boolean
    value: List<unknown>
} & WithOnChange> = (
    {
        valueSchemas, storeKeys, value, onChange,
        required, schema: parentSchema, disabled,
    },
) => (
    valueSchemas ?
        valueSchemas.map(({value: oneOfVal, schema, text, fallback, context}, i) => {
            const isActive = checkActive(value, oneOfVal)
            return <OptionCheck
                key={i}
                checked={isActive}
                disabled={Boolean(disabled || schema?.get('readOnly') as boolean)}
                onChange={() => {
                    onChange({
                        storeKeys,
                        scopes: ['value'],
                        type: 'update',
                        updater: ({value: val = List()}) => ({
                            value: sortScalarList(checkActive(val, oneOfVal) ?
                                val.delete(val.indexOf(oneOfVal)) :
                                val.push(oneOfVal)),
                        }),
                        schema: parentSchema,
                        required,
                    })
                }}
                label={<Translate
                    schema={schema?.get('t') as unknown as UISchemaMap}
                    text={text}
                    context={context}
                    fallback={fallback}
                />}
            />
        }).valueSeq()
        : null
)

const OptionsCheckValues = extractValue(memo(OptionsCheckValuesBase))

export interface OptionsCheckRendererProps {
    row?: boolean
}

export const OptionsCheck = (
    {
        schema, storeKeys, showValidity, valid, required, errors,
        row, binding,
    }: WidgetProps<BindingTypeGeneric & MuiBindingComponents> & OptionsCheckRendererProps,
): React.ReactElement => {
    const {valueSchemas} = useOptionsFromSchema(storeKeys, schema.get('items') as UISchemaMap)
    const InfoRenderer = binding?.InfoRenderer
    return <FormControl
        required={required} error={!valid && showValidity} component="fieldset" fullWidth
        size={schema.getIn(['view', 'dense']) ? 'small' : undefined}
        disabled={schema.get('readOnly') as boolean}
    >
        <FormLabel component="legend" style={{width: '100%'}}>
            <TranslateTitle schema={schema} storeKeys={storeKeys}/>
            {InfoRenderer && schema?.get('info') ?
                <InfoRenderer
                    schema={schema} variant={'icon'} openAs={'modal'}
                    storeKeys={storeKeys} valid={valid} errors={errors}
                    align={'right'} dense
                /> :
                undefined}
        </FormLabel>
        <FormGroup row={row}>
            <OptionsCheckValues
                valueSchemas={valueSchemas} storeKeys={storeKeys}
                required={required} schema={schema}
                disabled={schema.get('readOnly') as boolean}
            />
        </FormGroup>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>
}

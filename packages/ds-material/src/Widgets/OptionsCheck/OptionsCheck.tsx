import React from 'react'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { List } from 'immutable'
import { memo } from '@ui-schema/react/Utils/memo'
import { StoreKeys, WithValue, extractValue } from '@ui-schema/react/UIStore'
import { Translate } from '@ui-schema/react/Translate'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { useUID } from 'react-uid'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { sortScalarList } from '@ui-schema/system/Utils/sortScalarList'
import { MuiWidgetsBinding } from '@ui-schema/ds-material/WidgetsBinding'
import { SwitchBaseProps } from '@mui/material/internal/SwitchBase'
import { OptionValueSchema, useOptionsFromSchema } from '@ui-schema/ds-material/Utils'
import { InfoRendererType } from '@ui-schema/ds-material/Component'

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

const checkActive = (list: List<any>, name: string | undefined | number) => list && list.contains && typeof list.contains(name) !== 'undefined' ? list.contains(name) : false

const OptionsCheckValuesBase: React.ComponentType<{
    storeKeys: StoreKeys
    required?: boolean
    valueSchemas?: List<OptionValueSchema>
    schema: UISchemaMap
    disabled?: boolean
} & WithValue> = (
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
) as unknown as React.ReactElement

const OptionsCheckValues = extractValue(memo(OptionsCheckValuesBase))

export interface OptionsCheckRendererProps {
    row?: boolean
}

export const OptionsCheck = <P extends WidgetProps<MuiWidgetsBinding<{ InfoRenderer?: InfoRendererType }>> & OptionsCheckRendererProps>(
    {
        schema, storeKeys, schemaKeys, showValidity, valid, required, errors,
        row, widgets,
    }: P,
): React.ReactElement => {
    const {valueSchemas} = useOptionsFromSchema(storeKeys, schema.get('items') as UISchemaMap)
    const InfoRenderer = widgets?.InfoRenderer
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
                    storeKeys={storeKeys} schemaKeys={schemaKeys} valid={valid} errors={errors}
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

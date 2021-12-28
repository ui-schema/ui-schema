import React from 'react'
import {
    FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox,
} from '@material-ui/core'
import { Map, List, OrderedMap } from 'immutable'
import { TransTitle, Trans, beautifyKey, extractValue, memo, WidgetProps, StoreKeys, WithValue, tt, StoreSchemaType } from '@ui-schema/ui-schema'
import { useUID } from 'react-uid'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText'
import { sortScalarList } from '@ui-schema/ui-schema/Utils/sortScalarList'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'
import { SwitchBaseProps } from '@material-ui/core/internal/SwitchBase'

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

const OptionsCheckValueBase: React.ComponentType<{
    storeKeys: StoreKeys
    required?: boolean
    oneOfValues?: List<OrderedMap<string, string>>
    schema: StoreSchemaType
    disabled?: boolean
} & WithValue> = (
    {
        oneOfValues, storeKeys, value, onChange,
        required, schema, disabled,
    }
) => <>
    {oneOfValues ?
        oneOfValues.map((oneOfSchema) => {
            const oneOfVal = oneOfSchema.get('const')
            const isActive = checkActive(value, oneOfVal)

            return <OptionCheck
                key={oneOfVal}
                checked={isActive}
                disabled={disabled}
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
                        schema,
                        required,
                    })
                }}
                label={<Trans
                    schema={oneOfSchema.get('t') as unknown as StoreSchemaType}
                    text={oneOfSchema.get('title') as string || oneOfSchema.get('const') as string}
                    context={Map({'relative': List(['title'])})}
                    fallback={oneOfSchema.get('title') || beautifyKey(oneOfSchema.get('const') as string | number, oneOfSchema.get('tt') as tt)}
                />}
            />
        }).valueSeq()
        : null}
</>

const OptionsCheckValue = extractValue(memo(OptionsCheckValueBase))

export interface OptionsCheckRendererProps {
    row?: boolean
}

export const OptionsCheck: React.ComponentType<WidgetProps<{}, MuiWidgetBinding> & OptionsCheckRendererProps> = (
    {
        ownKey, schema, storeKeys, showValidity, valid, required, errors,
        row, widgets,
    }
) => {
    const oneOfVal = schema.getIn(['items', 'oneOf'])
    if (!oneOfVal) return null
    const InfoRenderer = widgets?.InfoRenderer
    return <FormControl required={required} error={!valid && showValidity} component="fieldset">
        <FormLabel component="legend" style={{width: '100%'}}>
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
            {InfoRenderer && schema?.get('info') ?
                <InfoRenderer
                    schema={schema} variant={'icon'} openAs={'modal'}
                    storeKeys={storeKeys} valid={valid} errors={errors}
                    align={'right'} dense
                /> :
                undefined}
        </FormLabel>
        <FormGroup row={row}>
            <OptionsCheckValue
                oneOfValues={oneOfVal as List<OrderedMap<string, string>>} storeKeys={storeKeys}
                required={required} schema={schema}
                disabled={schema.get('readOnly') as boolean}
            />
        </FormGroup>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>
}

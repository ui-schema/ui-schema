import React from 'react'
import TextField from '@mui/material/TextField'
import { InputProps } from '@mui/material/Input'
import { useUID } from 'react-uid'
import InputAdornment from '@mui/material/InputAdornment'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { schemaRulesToNative } from '@ui-schema/json-schema/schemaRulesToNative'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { convertStringToNumber } from '@ui-schema/ds-material/Utils/convertStringToNumber'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/system/schemaTypeIs'
import { NumberRendererProps, StringRendererProps, TextRendererProps } from '@ui-schema/ds-material/Widgets/TextField'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { WithScalarValue } from '@ui-schema/react/UIStore'
import { useDebounceValue } from '@ui-schema/react/Utils/useDebounceValue'
import { forbidInvalidNumber, InfoRendererType, MuiWidgetsBinding } from '@ui-schema/ds-material'

export interface StringRendererDebouncedProps {
    onKeyPress?: StringRendererProps['onKeyPress']
    debounceTime?: number
}

export const StringRendererDebounced = <P extends WidgetProps<MuiWidgetsBinding<{ InfoRenderer?: InfoRendererType }>> = WidgetProps<MuiWidgetsBinding<{ InfoRenderer?: InfoRendererType }>>>(
    {
        type,
        multiline,
        minRows, maxRows,
        storeKeys, schema, value, onChange,
        showValidity, valid, errors, required,
        style,
        onClick, onFocus, onBlur, onKeyUp, onKeyDown,
        onKeyPress,
        inputProps = {}, InputProps = {}, inputRef: customInputRef,
        debounceTime = 340, widgets,
    }: P & WithScalarValue & Omit<StringRendererProps, 'onKeyPress' | 'onKeyPressNative'> & StringRendererDebouncedProps
): React.ReactElement => {
    const uid = useUID()
    // todo: this could break law-of-hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inputRef = customInputRef || React.useRef()

    const setter = React.useCallback((newVal: string | number | undefined) => {
        onChange({
            storeKeys,
            scopes: ['value'],
            type: 'set',
            schema,
            required,
            data: {value: newVal},
        })
    }, [storeKeys, onChange, schema, required])

    const {bounceVal, setBounceVal, bubbleBounce} = useDebounceValue<string | number>(value as string | number | undefined, debounceTime, setter)

    const format = schema.get('format')

    inputProps = schemaRulesToNative(inputProps, schema)

    const hideTitle = schema.getIn(['view', 'hideTitle'])

    const InfoRenderer = widgets?.InfoRenderer
    if (InfoRenderer && schema?.get('info')) {
        InputProps['endAdornment'] = <InputAdornment position="end">
            <InfoRenderer
                schema={schema} variant={'icon'} openAs={'modal'}
                storeKeys={storeKeys} valid={valid} errors={errors}
            />
        </InputAdornment>
    }
    return <React.Fragment>
        <TextField
            label={hideTitle ? undefined : <TranslateTitle schema={schema} storeKeys={storeKeys}/>}
            aria-label={hideTitle ? <TranslateTitle schema={schema} storeKeys={storeKeys}/> as unknown as string : undefined}
            // changing `type` to `text`, to be able to change invalid data
            type={(format || (typeof bounceVal.value === 'string' && type === 'number' ? 'text' : type)) as InputProps['type']}
            disabled={schema.get('readOnly') as boolean | undefined}
            multiline={multiline}
            required={required}
            error={!valid && showValidity}
            minRows={minRows}
            maxRows={maxRows}
            inputRef={inputRef}
            fullWidth
            variant={schema.getIn(['view', 'variant']) as any}
            margin={schema.getIn(['view', 'margin']) as InputProps['margin']}
            size={schema.getIn(['view', 'dense']) ? 'small' : 'medium'}
            value={typeof bounceVal.value === 'string' || typeof bounceVal.value === 'number' ? bounceVal.value : ''}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur ? onBlur : () => {
                bubbleBounce(value as string)
            }}
            onKeyUp={onKeyUp}
            onKeyDown={
                onKeyDown ? onKeyDown :
                    e => forbidInvalidNumber(e.nativeEvent, schema.get('type') as string)
            }
            onKeyPress={onKeyPress}
            id={'uis-' + uid}
            style={style}
            onChange={(e) => {
                const val = e.target.value
                const schemaType = schema.get('type') as string
                const newVal = convertStringToNumber(val, schemaType)
                if (
                    schemaTypeIsNumeric(schemaType)
                    && newVal === '' && e.target.validity.badInput
                ) {
                    // forbid saving/deleting of invalid number at all
                    return undefined
                }
                setBounceVal({changed: true, value: newVal})
            }}
            InputLabelProps={{shrink: schema.getIn(['view', 'shrink']) as boolean}}
            InputProps={InputProps}
            inputProps={inputProps}
        />

        <ValidityHelperText
            errors={errors} showValidity={showValidity} schema={schema}
        />
    </React.Fragment>
}

export const TextRendererDebounced = <P extends WidgetProps<MuiWidgetsBinding> = WidgetProps<MuiWidgetsBinding>>(
    {
        schema,
        ...props
    }: P & WithScalarValue & Omit<TextRendererProps, 'onKeyPress' | 'onKeyPressNative'> & StringRendererDebouncedProps
): React.ReactElement => {
    return <StringRendererDebounced
        {...props}
        schema={schema}
        minRows={
            typeof props.minRows === 'number' ? props.minRows :
                schema.getIn(['view', 'rows'])
        }
        maxRows={
            typeof props.maxRows === 'number' ? props.maxRows :
                schema.getIn(['view', 'rowsMax'])
        }
        multiline
    />
}

export const NumberRendererDebounced = <P extends WidgetProps<MuiWidgetsBinding> = WidgetProps<MuiWidgetsBinding>>(props: P & WithScalarValue & Omit<NumberRendererProps, 'onKeyPress' | 'onKeyPressNative'> & StringRendererDebouncedProps): React.ReactElement => {
    const {schema, inputProps: inputPropsProps = {}, steps = 'any'} = props
    const schemaType = schema.get('type') as string | undefined
    const inputProps = React.useMemo(() => {
        if (schemaTypeIs(schemaType, 'number') && typeof inputPropsProps['step'] === 'undefined') {
            return {
                ...inputPropsProps,
                step: steps,
            }
        }
        return inputPropsProps
    }, [inputPropsProps, steps, schemaType])

    return <StringRendererDebounced
        {...props}
        inputProps={inputProps}
        type={'number'}
    />
}

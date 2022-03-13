import React from 'react'
import TextField from '@material-ui/core/TextField'
import { InputProps } from '@material-ui/core/Input'
import { useUID } from 'react-uid'
import InputAdornment from '@material-ui/core/InputAdornment'
import { TransTitle } from '@ui-schema/ui-schema/Translate/TransTitle'
import { mapSchema } from '@ui-schema/ui-schema/Utils/schemaToNative'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText'
import { convertStringToNumber } from '@ui-schema/ds-material/Utils/convertStringToNumber'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/ui-schema/Utils/schemaTypeIs'
import { NumberRendererProps, StringRendererProps, TextRendererProps } from '@ui-schema/ds-material/Widgets/TextField'
import { WidgetProps, WithScalarValue } from '@ui-schema/ui-schema'
import { useDebounceValue } from '@ui-schema/ui-schema/Utils/useDebounceValue'
import { forbidInvalidNumber, MuiWidgetBinding } from '@ui-schema/ds-material'

export interface StringRendererDebouncedProps {
    onKeyPress?: StringRendererProps['onKeyPressNative']
    debounceTime?: number
}

export const StringRendererDebounced = <P extends WidgetProps<MuiWidgetBinding> = WidgetProps<MuiWidgetBinding>>(
    {
        type,
        multiline,
        // eslint-disable-next-line deprecation/deprecation
        rows, rowsMax,
        minRows, maxRows,
        storeKeys, ownKey, schema, value, onChange,
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

    inputProps = mapSchema(inputProps, schema)

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
            label={hideTitle ? undefined : <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>}
            aria-label={hideTitle ? <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/> as unknown as string : undefined}
            // changing `type` to `text`, to be able to change invalid data
            type={(format || (typeof bounceVal.value === 'string' && type === 'number' ? 'text' : type)) as InputProps['type']}
            disabled={schema.get('readOnly') as boolean | undefined}
            multiline={multiline}
            required={required}
            error={!valid && showValidity}
            minRows={
                typeof minRows === 'number' ? minRows :
                    rows
            }
            maxRows={
                typeof maxRows === 'number' ? maxRows :
                    rowsMax
            }
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
            onKeyPress={
                onKeyPress ?
                    onKeyPress :
                    e => forbidInvalidNumber(e.nativeEvent, schema.get('type') as string)
            }
            id={'uis-' + uid}
            style={style}
            onKeyDown={onKeyDown}
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

export const TextRendererDebounced = <P extends WidgetProps<MuiWidgetBinding> = WidgetProps<MuiWidgetBinding>>(
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
                // eslint-disable-next-line deprecation/deprecation
                (props.rows || schema.getIn(['view', 'rows']))
        }
        maxRows={
            typeof props.maxRows === 'number' ? props.maxRows :
                // eslint-disable-next-line deprecation/deprecation
                (props.rowsMax || schema.getIn(['view', 'rowsMax']))
        }
        multiline
    />
}

export const NumberRendererDebounced = <P extends WidgetProps<MuiWidgetBinding> = WidgetProps<MuiWidgetBinding>>(props: P & WithScalarValue & Omit<NumberRendererProps, 'onKeyPress' | 'onKeyPressNative'> & StringRendererDebouncedProps): React.ReactElement => {
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
    }, [inputPropsProps, schemaType])

    return <StringRendererDebounced
        {...props}
        inputProps={inputProps}
        type={'number'}
    />
}

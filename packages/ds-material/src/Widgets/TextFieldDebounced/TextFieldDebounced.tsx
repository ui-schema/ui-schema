import React from 'react'
import TextField from '@material-ui/core/TextField'
import { InputProps } from '@material-ui/core/Input'
import { useUID } from 'react-uid'
import { TransTitle } from '@ui-schema/ui-schema/Translate/TransTitle'
import { mapSchema } from '@ui-schema/ui-schema/Utils/schemaToNative'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText'
import { convertStringToNumber } from '@ui-schema/ds-material/Utils/convertStringToNumber'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/ui-schema/Utils/schemaTypeIs'
import { NumberRendererProps, StringRendererProps, TextRendererProps } from '@ui-schema/ds-material/Widgets/TextField'
import { WidgetProps, WithScalarValue } from '@ui-schema/ui-schema'
import { forbidInvalidNumber } from '@ui-schema/ds-material'

export interface StringRendererDebouncedProps {
    onKeyPress?: StringRendererProps['onKeyPressNative']
    debounceTime?: number
}

export const StringRendererDebounced = <P extends WidgetProps = WidgetProps>(
    {
        type,
        multiline, rows, rowsMax,
        storeKeys, ownKey, schema, value, onChange,
        showValidity, valid, errors, required,
        style,
        onClick, onFocus, onBlur, onKeyUp, onKeyDown,
        onKeyPress,
        inputProps = {}, InputProps = {}, inputRef: customInputRef,
        debounceTime = 340,
    }: P & WithScalarValue & Omit<StringRendererProps, 'onKeyPress' | 'onKeyPressNative'> & StringRendererDebouncedProps
): React.ReactElement => {
    const timer = React.useRef<undefined | number>(undefined)
    const [compVal, setCompVal] = React.useState<string | number | undefined>(undefined)
    const uid = useUID()
    // todo: this could break law-of-hooks
    const inputRef = customInputRef || React.useRef()

    React.useEffect(() => {
        window.clearTimeout(timer.current)
        setCompVal(value as string)
    }, [value, timer])

    const setter = React.useCallback((maybeVal: string | number | undefined) => {
        const newVal = convertStringToNumber(maybeVal, schemaType)
        if (schemaTypeIsNumeric(schemaType) && maybeVal === '') {
            // forbid saving/deleting of invalid number at all
            setCompVal('')
            return undefined
        }
        onChange(
            storeKeys, ['value'],
            {
                type: 'update',
                updater: () => ({value: newVal}),
                schema,
                required,
            },
        )
    }, [onChange, schema, required])

    const schemaType = schema.get('type') as string
    React.useEffect(() => {
        timer.current = window.setTimeout(() => {
            setter(compVal)
        }, debounceTime)
        return () => window.clearTimeout(timer.current)
    }, [
        compVal, setCompVal,
        debounceTime,
        schemaType, timer,
        setter,
    ])

    const format = schema.get('format')

    inputProps = mapSchema(inputProps, schema)

    const hideTitle = schema.getIn(['view', 'hideTitle'])
    return <React.Fragment>
        <TextField
            label={hideTitle ? undefined : <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>}
            aria-label={hideTitle ? <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/> as unknown as string : undefined}
            // changing `type` to `text`, to be able to change invalid data
            type={(format || (typeof value === 'string' && type === 'number' ? 'text' : type)) as InputProps['type']}
            disabled={schema.get('readOnly') as boolean | undefined}
            multiline={multiline}
            required={required}
            error={!valid && showValidity}
            rows={rows}
            inputRef={inputRef}
            rowsMax={rowsMax}
            fullWidth
            variant={schema.getIn(['view', 'variant']) as any}
            margin={schema.getIn(['view', 'margin']) as InputProps['margin']}
            size={schema.getIn(['view', 'dense']) ? 'small' : 'medium'}
            value={typeof compVal === 'string' || typeof compVal === 'number' ? compVal : ''}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur ? onBlur : () => {
                if (compVal === value) return
                window.clearTimeout(timer.current)
                setter(compVal)
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
                console.log(newVal)
                if (
                    schemaTypeIsNumeric(schemaType)
                    && newVal === '' && e.target.validity.badInput
                ) {
                    // forbid saving/deleting of invalid number at all
                    return undefined
                }
                setCompVal(newVal)
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

export const TextRendererDebounced = <P extends WidgetProps = WidgetProps>({schema, ...props}: P & WithScalarValue & Omit<TextRendererProps, 'onKeyPress' | 'onKeyPressNative'> & StringRendererDebouncedProps): React.ReactElement => {
    return <StringRendererDebounced
        {...props}
        schema={schema}
        rows={props.rows || schema.getIn(['view', 'rows'])}
        rowsMax={props.rowsMax || schema.getIn(['view', 'rowsMax'])}
        multiline
    />
}

export const NumberRendererDebounced = <P extends WidgetProps = WidgetProps>(props: P & WithScalarValue & Omit<NumberRendererProps, 'onKeyPress' | 'onKeyPressNative'> & StringRendererDebouncedProps): React.ReactElement => {
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

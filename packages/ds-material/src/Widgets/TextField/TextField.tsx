import React, { CSSProperties, FocusEventHandler, KeyboardEventHandler, MouseEventHandler } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { InputProps } from '@mui/material/Input'
import { useUID } from 'react-uid'
import { TransTitle } from '@ui-schema/ui-schema/Translate/TransTitle'
import { mapSchema } from '@ui-schema/ui-schema/Utils/schemaToNative'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText'
import { convertStringToNumber } from '@ui-schema/ds-material/Utils/convertStringToNumber'
import { forbidInvalidNumber } from '@ui-schema/ds-material/Utils'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/ui-schema/Utils/schemaTypeIs'
import { WidgetProps, WithScalarValue } from '@ui-schema/ui-schema'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'

export interface StringRendererBaseProps {
    type?: string
    style?: CSSProperties
    onClick?: MouseEventHandler<HTMLDivElement> | undefined
    onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
    onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
    onKeyUp?: KeyboardEventHandler<HTMLDivElement> | undefined
    onKeyDown?: KeyboardEventHandler<HTMLDivElement> | undefined
    /**
     * @deprecated
     */
    onKeyPress?: (e: KeyboardEvent) => void | undefined
    onKeyPressNative?: KeyboardEventHandler<HTMLDivElement> | undefined
    inputProps?: InputProps['inputProps']
    InputProps?: Partial<InputProps>
    inputRef?: any
}

export interface StringRendererProps extends StringRendererBaseProps {
    multiline?: boolean
    /**
     * @deprecated use `minRows` instead
     */
    rows?: number
    /**
     * @deprecated use `maxRows` instead
     */
    rowsMax?: number

    minRows?: number

    maxRows?: number
}

export interface TextRendererProps extends StringRendererProps {
    multiline?: true
}

export interface NumberRendererProps extends StringRendererBaseProps {
    steps?: number | 'any'
}

export const StringRenderer = <P extends WidgetProps<MuiWidgetBinding> = WidgetProps<MuiWidgetBinding>>(
    {
        type,
        multiline,
        // eslint-disable-next-line deprecation/deprecation
        rows, rowsMax,
        minRows, maxRows,
        storeKeys, schema, value, onChange,
        showValidity, valid, errors, required,
        style,
        onClick, onFocus, onBlur, onKeyUp, onKeyDown,
        onKeyPressNative: onKeyPress,
        // eslint-disable-next-line deprecation/deprecation
        onKeyPress: onKeyPressDeprecated,
        inputProps = {}, InputProps = {}, inputRef: customInputRef,
        widgets,
    }: P & WithScalarValue & StringRendererProps
): React.ReactElement => {
    const uid = useUID()
    // todo: this could break law-of-hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inputRef = customInputRef || React.useRef()

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
            label={hideTitle ? undefined : <TransTitle schema={schema} storeKeys={storeKeys}/>}
            aria-label={hideTitle ? <TransTitle schema={schema} storeKeys={storeKeys}/> as unknown as string : undefined}
            // changing `type` to `text`, to be able to change invalid data
            type={(format || (typeof value === 'string' && type === 'number' ? 'text' : type)) as InputProps['type']}
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
            value={
                typeof value === 'string' || typeof value === 'number' ? value : ''
            }
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
            onKeyPress={onKeyPress ? onKeyPress : e => {
                const evt = e.nativeEvent
                if (!forbidInvalidNumber(evt, schema.get('type') as string)) {
                    onKeyPressDeprecated && onKeyPressDeprecated(evt)
                }
            }}
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
                onChange({
                    storeKeys,
                    scopes: ['value'],
                    type: 'set',
                    schema,
                    required,
                    data: {value: newVal},
                })
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

export const TextRenderer = <P extends WidgetProps<MuiWidgetBinding> = WidgetProps<MuiWidgetBinding>>({schema, ...props}: P & WithScalarValue & TextRendererProps): React.ReactElement => {
    return <StringRenderer
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

export const NumberRenderer = <P extends WidgetProps<MuiWidgetBinding> = WidgetProps<MuiWidgetBinding>>(props: P & WithScalarValue & NumberRendererProps): React.ReactElement => {
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

    return <StringRenderer
        {...props}
        inputProps={inputProps}
        type={'number'}
    />
}

import React, { CSSProperties, FocusEventHandler, KeyboardEventHandler, MouseEventHandler } from 'react'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { InputProps } from '@material-ui/core/Input'
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
    rows?: number
    rowsMax?: number
}

export interface TextRendererProps extends StringRendererProps {
    multiline?: true
}

export interface NumberRendererProps extends StringRendererBaseProps {
    steps?: number | 'any'
}

export const StringRenderer = <P extends WidgetProps<{}, MuiWidgetBinding> = WidgetProps<{}, MuiWidgetBinding>>(
    {
        type,
        multiline, rows, rowsMax,
        storeKeys, ownKey, schema, value, onChange,
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
                onChange(
                    storeKeys, ['value'],
                    {
                        type: 'update',
                        // setting the actual val when invalid, e.g. at numbers, it allows correcting invalid data without a "reset"
                        //updater: () => ({value: typeof newVal === 'undefined' ? val : newVal}),
                        updater: () => ({value: newVal}),
                        schema,
                        required,
                    },
                )
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

export const TextRenderer = <P extends WidgetProps<{}, MuiWidgetBinding> = WidgetProps<{}, MuiWidgetBinding>>({schema, ...props}: P & WithScalarValue & TextRendererProps): React.ReactElement => {
    return <StringRenderer
        {...props}
        schema={schema}
        rows={props.rows || schema.getIn(['view', 'rows'])}
        rowsMax={props.rowsMax || schema.getIn(['view', 'rowsMax'])}
        multiline
    />
}

export const NumberRenderer = <P extends WidgetProps<{}, MuiWidgetBinding> = WidgetProps<{}, MuiWidgetBinding>>(props: P & WithScalarValue & NumberRendererProps): React.ReactElement => {
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

    return <StringRenderer
        {...props}
        inputProps={inputProps}
        type={'number'}
    />
}

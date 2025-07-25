import { MuiBindingComponents } from '@ui-schema/ds-material/Binding'
import * as React from 'react'
import type { CSSProperties, FocusEventHandler, KeyboardEventHandler, MouseEventHandler } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { InputProps } from '@mui/material/Input'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { schemaRulesToNative } from '@ui-schema/ui-schema/schemaRulesToNative'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { convertStringToNumber } from '@ui-schema/ds-material/Utils/convertStringToNumber'
import { forbidInvalidNumber } from '@ui-schema/ds-material/Utils/forbidInvalidNumber'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/ui-schema/schemaTypeIs'
import { WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'

export interface StringRendererBaseProps {
    type?: string
    style?: CSSProperties
    onClick?: MouseEventHandler<HTMLDivElement> | undefined
    onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
    onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
    onKeyUp?: KeyboardEventHandler<HTMLDivElement> | undefined
    onKeyDown?: KeyboardEventHandler<HTMLDivElement> | undefined
    /**
     * @deprecated may not be available in newer browser [MDN spec](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onkeypress)
     */
    onKeyPress?: KeyboardEventHandler<HTMLDivElement> | undefined
    inputProps?: InputProps['inputProps']
    InputProps?: Partial<InputProps>
    inputRef?: any
}

export interface StringRendererProps extends StringRendererBaseProps {
    multiline?: boolean
    minRows?: number
    maxRows?: number
}

export interface TextRendererProps extends StringRendererProps {
    multiline?: true
}

export interface NumberRendererProps extends StringRendererBaseProps {
    steps?: number | 'any'
}

export const StringRenderer = (
    {
        type,
        multiline,
        minRows, maxRows,
        storeKeys, schema, value, onChange, keysToName,
        showValidity, valid, errors, required,
        style,
        onClick, onFocus, onBlur, onKeyUp, onKeyDown,
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        onKeyPress,
        inputProps = {}, InputProps = {}, inputRef: customInputRef,
        binding,
    }: WidgetProps<BindingTypeGeneric & MuiBindingComponents> & StringRendererProps,
): React.ReactElement => {
    const uid = React.useId()
    // todo: this could break law-of-hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inputRef = customInputRef || React.useRef(null)

    const format = schema.get('format')

    const inputPropsFromSchema = schemaRulesToNative(schema)

    const hideTitle = schema.getIn(['view', 'hideTitle'])
    const InfoRenderer = binding?.InfoRenderer
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
            type={(format || (typeof value === 'string' && type === 'number' ? 'text' : type)) as InputProps['type']}
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
            name={keysToName?.(storeKeys)}
            value={typeof value === 'string' || typeof value === 'number' ? value : ''}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
            onKeyDown={
                onKeyDown ? onKeyDown :
                    e => forbidInvalidNumber(e.nativeEvent, schema.get('type') as unknown as string)
            }
            /* eslint-disable-next-line @typescript-eslint/no-deprecated */
            onKeyPress={onKeyPress}
            style={style}
            id={'uis-' + uid}
            onChange={(e) => {
                const val = e.target.value
                const schemaType = schema.get('type') as unknown as string
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
            /* eslint-disable-next-line @typescript-eslint/no-deprecated */
            InputLabelProps={{shrink: schema.getIn(['view', 'shrink']) as boolean}}
            /* eslint-disable-next-line @typescript-eslint/no-deprecated */
            InputProps={InputProps}
            /* eslint-disable-next-line @typescript-eslint/no-deprecated */
            inputProps={inputProps && inputPropsFromSchema ? {...inputPropsFromSchema, ...inputProps} : inputProps || inputPropsFromSchema}
        />

        <ValidityHelperText
            errors={errors} showValidity={showValidity} schema={schema}
        />
    </React.Fragment>
}

export const TextRenderer = ({schema, ...props}: WidgetProps<BindingTypeGeneric & MuiBindingComponents> & TextRendererProps): React.ReactElement => {
    return <StringRenderer
        {...props}
        schema={schema}
        minRows={
            typeof props.minRows === 'number' ? props.minRows :
                schema.getIn(['view', 'rows']) as number
        }
        maxRows={
            typeof props.maxRows === 'number' ? props.maxRows :
                schema.getIn(['view', 'rowsMax']) as number
        }
        multiline
    />
}

export const NumberRenderer = (props: WidgetProps<BindingTypeGeneric & MuiBindingComponents> & NumberRendererProps): React.ReactElement => {
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

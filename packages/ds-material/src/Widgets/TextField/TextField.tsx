import React, { CSSProperties, FocusEventHandler, KeyboardEventHandler, MouseEventHandler } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { InputProps } from '@mui/material/Input'
import { useUID } from 'react-uid'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { schemaRulesToNative } from '@ui-schema/json-schema/schemaRulesToNative'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { convertStringToNumber } from '@ui-schema/ds-material/Utils/convertStringToNumber'
import { forbidInvalidNumber } from '@ui-schema/ds-material/Utils'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/system/schemaTypeIs'
import { WithScalarValue } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { InfoRendererType } from '@ui-schema/ds-material/Component'
import { CustomLeafsRenderMapping } from '@ui-schema/react/UIEngine'

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

export const StringRenderer = <P extends WidgetProps & { render: CustomLeafsRenderMapping<{}, { InfoRenderer?: InfoRendererType }> }>(
    {
        type,
        multiline,
        minRows, maxRows,
        storeKeys, schemaKeys, schema, value, onChange,
        showValidity, valid, errors, required,
        style,
        onClick, onFocus, onBlur, onKeyUp, onKeyDown,
        // eslint-disable-next-line deprecation/deprecation
        onKeyPress,
        inputProps = {}, InputProps = {}, inputRef: customInputRef,
        render,
    }: P & WithScalarValue & StringRendererProps,
): React.ReactElement => {
    const uid = useUID()
    // todo: this could break law-of-hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inputRef = customInputRef || React.useRef()

    const format = schema.get('format')

    inputProps = schemaRulesToNative(inputProps, schema)

    const hideTitle = schema.getIn(['view', 'hideTitle'])
    const InfoRenderer = render.components?.InfoRenderer
    if (InfoRenderer && schema?.get('info')) {
        InputProps['endAdornment'] = <InputAdornment position="end">
            <InfoRenderer
                schema={schema} variant={'icon'} openAs={'modal'}
                storeKeys={storeKeys} schemaKeys={schemaKeys} valid={valid} errors={errors}
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
            // todo: switch to "`small` when dense, `undefined` otherwise" to be able to use mui-theming for defaults
            size={schema.getIn(['view', 'dense']) ? 'small' : 'medium'}
            value={typeof value === 'string' || typeof value === 'number' ? value : ''}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
            onKeyDown={
                onKeyDown ? onKeyDown :
                    e => forbidInvalidNumber(e.nativeEvent, schema.get('type') as unknown as string)
            }
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
            InputLabelProps={{shrink: schema.getIn(['view', 'shrink']) as boolean}}
            InputProps={InputProps}
            inputProps={inputProps}
        />

        <ValidityHelperText
            errors={errors} showValidity={showValidity} schema={schema}
        />
    </React.Fragment>
}

export const TextRenderer = <P extends WidgetProps & { render: CustomLeafsRenderMapping<{}, { InfoRenderer?: InfoRendererType }> }>(
    {
        schema, ...props
    }: P & WithScalarValue & TextRendererProps,
): React.ReactElement => {
    return <StringRenderer
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

export const NumberRenderer = <P extends WidgetProps & { render: CustomLeafsRenderMapping<{}, { InfoRenderer?: InfoRendererType }> }>(
    props: P & WithScalarValue & NumberRendererProps,
): React.ReactElement => {
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

import * as React from 'react'
import TextField from '@mui/material/TextField'
import type { InputProps } from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { schemaRulesToNative } from '@ui-schema/ui-schema/schemaRulesToNative'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { convertStringToNumber } from '@ui-schema/ds-material/Utils/convertStringToNumber'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/ui-schema/schemaTypeIs'
import type { NumberRendererProps, StringRendererProps, TextRendererProps } from '@ui-schema/ds-material/Widgets/TextField'
import type { WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'
import { useDebounceValue } from '@ui-schema/react/Utils/useDebounceValue'
import { forbidInvalidNumber } from '@ui-schema/ds-material/Utils/forbidInvalidNumber'
import type { MuiBindingComponents } from '@ui-schema/ds-material/BindingType'

export interface StringRendererDebouncedProps {
    /**
     * @deprecated
     */
    onKeyPress?: StringRendererProps['onKeyPress']
    debounceTime?: number
}

export const StringRendererDebounced = (
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
        debounceTime = 340, binding,
    }: WidgetProps<BindingTypeGeneric & MuiBindingComponents> & Omit<StringRendererProps, 'onKeyPress' | 'onKeyPressNative'> & StringRendererDebouncedProps,
): React.ReactElement => {
    const uid = React.useId()
    // todo: this could break law-of-hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inputRef = customInputRef || React.useRef(null)

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
            name={keysToName?.(storeKeys)}
            value={typeof bounceVal.value === 'string' || typeof bounceVal.value === 'number' ? bounceVal.value : ''}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur ? onBlur : () => {
                bubbleBounce(value as string)
            }}
            onKeyUp={onKeyUp}
            onKeyDown={
                onKeyDown ? onKeyDown :
                    e => forbidInvalidNumber(e.nativeEvent, schema.get('type') as unknown as string)
            }
            /* eslint-disable-next-line @typescript-eslint/no-deprecated */
            onKeyPress={onKeyPress}
            id={'uis-' + uid}
            style={style}
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
                setBounceVal({changed: true, value: newVal})
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

export const TextRendererDebounced = (
    {
        schema,
        ...props
    }: WidgetProps<BindingTypeGeneric & MuiBindingComponents> & Omit<TextRendererProps, 'onKeyPress' | 'onKeyPressNative'> & StringRendererDebouncedProps,
): React.ReactElement => {
    return <StringRendererDebounced
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

export const NumberRendererDebounced = (props: WidgetProps<BindingTypeGeneric & MuiBindingComponents> & Omit<NumberRendererProps, 'onKeyPress' | 'onKeyPressNative'> & StringRendererDebouncedProps): React.ReactElement => {
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

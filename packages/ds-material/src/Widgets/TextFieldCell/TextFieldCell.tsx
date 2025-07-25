import { MuiBindingComponents } from '@ui-schema/ds-material/Binding'
import * as React from 'react'
import type { CSSProperties, EventHandler } from 'react'
import { WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/ui-schema/schemaTypeIs'
import { schemaRulesToNative } from '@ui-schema/ui-schema/schemaRulesToNative'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import InputBase, { InputBaseProps, InputBaseComponentProps } from '@mui/material/InputBase'
import { convertStringToNumber } from '@ui-schema/ds-material/Utils/convertStringToNumber'
import { forbidInvalidNumber } from '@ui-schema/ds-material/Utils/forbidInvalidNumber'
import visuallyHidden from '@mui/utils/visuallyHidden'

export interface StringRendererCellProps {
    type?: string
    multiline?: boolean
    minRows?: number
    maxRows?: number
    style?: CSSProperties
    onClick?: EventHandler<any>
    onFocus?: EventHandler<any>
    onBlur?: EventHandler<any>
    onKeyUp?: EventHandler<any>
    onKeyDown?: EventHandler<any>
    /**
     * @deprecated may not be available in newer browser [MDN spec](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onkeypress)
     */
    onKeyPress?: EventHandler<any>
    inputProps?: Partial<InputBaseComponentProps>
    inputRef?: null | React.RefObject<any>
    labelledBy?: string
}

export const StringRendererCell: React.ComponentType<WidgetProps<BindingTypeGeneric & MuiBindingComponents> & StringRendererCellProps> = (
    {
        type,
        multiline, minRows, maxRows,
        storeKeys, schema, value, onChange, keysToName,
        showValidity, valid, errors, required,
        style = {},
        onClick, onFocus, onBlur, onKeyUp, onKeyDown,
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        onKeyPress,
        inputProps: inputPropsProp = {},
        inputRef: customInputRef,
        labelledBy, binding,
    },
) => {
    const uid = React.useId()
    // todo: this could break law-of-hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inputRef = customInputRef || React.useRef(null)

    const format = schema.get('format') as string | undefined
    const currentRef = inputRef.current

    const inputPropsFromSchema = schemaRulesToNative(schema)
    const inputProps = {...inputPropsProp}

    if (schemaTypeIs(schema.get('type') as SchemaTypesType, 'number') && typeof inputPropsFromSchema['step'] === 'undefined') {
        //inputProps['step'] = 'any'
    }

    if (typeof labelledBy === 'string') {
        inputProps['aria-labelledby'] = labelledBy
    } else {
        inputProps['aria-labelledby'] = 'uis-' + uid
    }

    if (!inputProps.style) {
        inputProps.style = {}
    }
    const schemaAlign = schema.getIn(['view', 'align'])
    if (!inputProps.style.textAlign && schemaAlign) {
        inputProps.style.textAlign = schemaAlign as React.CSSProperties['textAlign'] | undefined
    }
    if (type === 'number') {
        // when a table cell is of type number, it should be aligned right
        if (!inputProps.style.textAlign) {
            inputProps.style.textAlign = 'right'
        }
        if (
            inputProps.style.textAlign === 'right' &&
            !inputProps.style['MozAppearance']
        ) {
            inputProps.style['MozAppearance'] = 'textfield'
        }
    }

    if (typeof inputProps.style.minWidth === 'undefined') {
        inputProps.style.minWidth = schema.getIn(['view', 'minWidth']) as any || '40px'
    }

    const InfoRenderer = binding?.InfoRenderer
    return <>
        {!labelledBy ? <span style={visuallyHidden} id={inputProps['aria-labelledby']}>
            <TranslateTitle schema={schema} storeKeys={storeKeys}/>
        </span> : null}
        <InputBase
            type={format || type}
            disabled={schema.get('readOnly') as boolean}
            multiline={multiline}
            required={required}
            error={!valid && showValidity}
            inputRef={inputRef}
            minRows={minRows}
            maxRows={maxRows}
            fullWidth
            margin={schema.getIn(['view', 'margin']) as InputBaseProps['margin']}
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
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            onKeyPress={onKeyPress}
            style={style}
            onChange={(e) => {
                const val = e.target.value
                const schemaType = schema.get('type') as SchemaTypesType
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
            inputProps={inputProps && inputPropsFromSchema ? {...inputPropsFromSchema, ...inputProps} : inputProps || inputPropsFromSchema}
            endAdornment={
                InfoRenderer && schema?.get('info') ?
                    <InfoRenderer
                        schema={schema} variant={'icon'} openAs={'modal'}
                        storeKeys={storeKeys} valid={valid} errors={errors}
                    /> :
                    undefined
            }
        />

        <ValidityHelperText
            errors={errors} showValidity={showValidity} schema={schema}
            browserError={currentRef ? currentRef.validationMessage : ''}
        />
    </>
}

export const TextRendererCell: React.ComponentType<WidgetProps<BindingTypeGeneric & MuiBindingComponents> & StringRendererCellProps> = ({schema, ...props}) => {
    return <StringRendererCell
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

export const NumberRendererCell: React.ComponentType<WidgetProps<BindingTypeGeneric & MuiBindingComponents> & StringRendererCellProps> = (props) => {
    return <StringRendererCell
        {...props}
        type={'number'}
    />
}

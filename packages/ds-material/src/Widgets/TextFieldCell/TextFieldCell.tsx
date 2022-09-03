import React, { CSSProperties, EventHandler } from 'react'
import { useUID } from 'react-uid'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { WithScalarValue } from '@ui-schema/react/UIStore'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/system/schemaTypeIs'
import { schemaRulesToNative } from '@ui-schema/json-schema/schemaRulesToNative'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import InputBase, { InputBaseProps, InputBaseComponentProps } from '@mui/material/InputBase'
import { convertStringToNumber } from '@ui-schema/ds-material/Utils/convertStringToNumber'
import { forbidInvalidNumber } from '@ui-schema/ds-material/Utils'
import { MuiWidgetsBinding } from '@ui-schema/ds-material/WidgetsBinding'
import { visuallyHidden } from '@mui/utils'
import { InfoRendererType } from '@ui-schema/ds-material/Component'

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

export const StringRendererCell: React.ComponentType<WidgetProps<MuiWidgetsBinding<{ InfoRenderer?: InfoRendererType }>> & WithScalarValue & StringRendererCellProps> = (
    {
        type,
        multiline, minRows, maxRows,
        storeKeys, schema, value, onChange,
        showValidity, valid, errors, required,
        style = {},
        onClick, onFocus, onBlur, onKeyUp, onKeyDown,
        // eslint-disable-next-line deprecation/deprecation
        onKeyPress,
        inputProps = {},
        inputRef: customInputRef,
        labelledBy, widgets,
    }
) => {
    const uid = useUID()
    // todo: this could break law-of-hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inputRef = customInputRef || React.useRef()

    const format = schema.get('format') as string | undefined
    const currentRef = inputRef.current

    inputProps = schemaRulesToNative(inputProps, schema)

    if (schemaTypeIs(schema.get('type') as SchemaTypesType, 'number') && typeof inputProps['step'] === 'undefined') {
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
    const InfoRenderer = widgets?.InfoRenderer
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
            value={typeof value === 'string' || typeof value === 'number' ? value : ''}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
            onKeyDown={
                onKeyDown ? onKeyDown :
                    e => forbidInvalidNumber(e.nativeEvent, schema.get('type') as string)
            }
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
            inputProps={inputProps}
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

export const TextRendererCell: React.ComponentType<WidgetProps<MuiWidgetsBinding> & WithScalarValue & StringRendererCellProps> = ({schema, ...props}) => {
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

export const NumberRendererCell: React.ComponentType<WidgetProps<MuiWidgetsBinding> & WithScalarValue & StringRendererCellProps> = (props) => {
    return <StringRendererCell
        {...props}
        type={'number'}
    />
}

import React, { CSSProperties, EventHandler } from 'react'
import { useUID } from 'react-uid'
import { WidgetProps, WithScalarValue } from '@ui-schema/ui-schema'
import { TransTitle } from '@ui-schema/ui-schema/Translate/TransTitle'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/ui-schema/Utils/schemaTypeIs'
import { mapSchema } from '@ui-schema/ui-schema/Utils/schemaToNative'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText'
import InputBase, { InputBaseProps, InputBaseComponentProps } from '@mui/material/InputBase'
import { convertStringToNumber } from '@ui-schema/ds-material/Utils/convertStringToNumber'
import { forbidInvalidNumber } from '@ui-schema/ds-material/Utils'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'
import { visuallyHidden } from '@mui/utils'

export interface StringRendererCellProps {
    type?: string
    multiline?: boolean
    rows?: number
    rowsMax?: number
    style?: CSSProperties
    onClick?: EventHandler<any>
    onFocus?: EventHandler<any>
    onBlur?: EventHandler<any>
    onKeyUp?: EventHandler<any>
    onKeyDown?: EventHandler<any>
    onKeyPress?: EventHandler<any>
    inputProps?: Partial<InputBaseComponentProps>
    inputRef?: null | React.RefObject<any>
    labelledBy?: string
}

export const StringRendererCell: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithScalarValue & StringRendererCellProps> = (
    {
        type,
        multiline, rows, rowsMax,
        storeKeys, schema, value, onChange,
        showValidity, valid, errors, required,
        style = {},
        onClick, onFocus, onBlur, onKeyUp, onKeyDown, onKeyPress,
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

    inputProps = mapSchema(inputProps, schema)

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
            <TransTitle schema={schema} storeKeys={storeKeys}/>
        </span> : null}
        <InputBase
            type={format || type}
            disabled={schema.get('readOnly') as boolean}
            multiline={multiline}
            required={required}
            error={!valid && showValidity}
            rows={rows}
            inputRef={inputRef}
            maxRows={rowsMax}
            fullWidth
            margin={schema.getIn(['view', 'margin']) as InputBaseProps['margin']}
            value={typeof value === 'string' || typeof value === 'number' ? value : ''}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
            onKeyPress={e => {
                const evt = e.nativeEvent
                if (!forbidInvalidNumber(evt, schema.get('type') as SchemaTypesType)) {
                    onKeyPress && onKeyPress(evt)
                }
            }}
            style={style}
            onKeyDown={onKeyDown}
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

export const TextRendererCell: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithScalarValue & StringRendererCellProps> = ({schema, ...props}) => {
    return <StringRendererCell
        {...props}
        schema={schema}
        rows={schema.getIn(['view', 'rows']) as number | undefined}
        rowsMax={schema.getIn(['view', 'rowsMax']) as number | undefined}
        multiline
    />
}

export const NumberRendererCell: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithScalarValue & StringRendererCellProps> = (props) => {
    return <StringRendererCell
        {...props}
        type={'number'}
    />
}

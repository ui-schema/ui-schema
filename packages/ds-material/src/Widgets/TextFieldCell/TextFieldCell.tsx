import React, { CSSProperties, EventHandler } from 'react'
import { mapSchema, checkNativeValidity, WidgetProps } from '@ui-schema/ui-schema'
import { ValidityHelperText } from '../../Component/LocaleHelperText/LocaleHelperText'
import InputBase from '@material-ui/core/InputBase'
import { convertStringToNumber } from '@ui-schema/ds-material/Utils/convertStringToNumber'

export interface StringRendererCellProps {
    type?: string
    multiline?: boolean
    rows?: number
    rowsMax?: number
    style?: CSSProperties
    onClick: EventHandler<any>
    onFocus: EventHandler<any>
    onBlur: EventHandler<any>
    onKeyUp: EventHandler<any>
    onKeyDown: EventHandler<any>
    onKeyPress: EventHandler<any>
    inputProps: {
        [key: string]: any
    }
    inputRef?: null | React.RefObject<any>
    labelledBy: string
}

export const StringRendererCell: React.ComponentType<WidgetProps & StringRendererCellProps> = (
    {
        type,
        multiline, rows, rowsMax,
        storeKeys, schema, value, onChange,
        showValidity, valid, errors, required,
        style,
        onClick, onFocus, onBlur, onKeyUp, onKeyDown, onKeyPress,
        inputProps = {}, inputRef: customInputRef,
        labelledBy,
    }
) => {
    // todo: this could break law-of-hooks
    const inputRef = customInputRef || React.useRef()

    const format = schema.get('format') as string | undefined
    const currentRef = inputRef.current

    inputProps = mapSchema(inputProps, schema)

    if (schema.get('type') === 'number' && typeof inputProps['step'] === 'undefined') {
        inputProps['step'] = 'any'
    }

    if (schema.get('checkNativeValidity')) {
        valid = checkNativeValidity(currentRef, valid)
    }

    React.useEffect(() => {
        if (currentRef) {
            onChange(storeKeys, ['valid'], () => ({valid: valid}))
        }
    }, [onChange, storeKeys, valid])

    return <>
        <InputBase
            type={format || type}
            disabled={schema.get('readOnly') as boolean}
            multiline={multiline}
            required={required}
            error={!valid && showValidity}
            rows={rows}
            inputRef={inputRef}
            rowsMax={rowsMax}
            fullWidth
            margin={schema.getIn(['view', 'margin'])}
            value={typeof value !== 'undefined' ? value : ''}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
            onKeyPress={onKeyPress}
            aria-labelledby={labelledBy}
            style={style}
            onKeyDown={onKeyDown}
            onChange={(e) => {
                const val = e.target.value
                onChange(
                    storeKeys, ['value'],
                    () => ({value: convertStringToNumber(val, schema.get('type') as string)}),
                    //schema.get('deleteOnEmpty') as boolean || required,
                    false,
                    schema.get('type') as string
                )
            }}
            inputProps={inputProps}
        />

        <ValidityHelperText
            errors={errors} showValidity={showValidity} schema={schema}
            browserError={currentRef ? currentRef.validationMessage : ''}
        />
    </>
}

export const TextRendererCell: React.ComponentType<WidgetProps & StringRendererCellProps> = ({schema, ...props}) => {
    return <StringRendererCell
        {...props}
        schema={schema}
        rows={schema.getIn(['view', 'rows'])}
        rowsMax={schema.getIn(['view', 'rowsMax'])}
        multiline
    />
}

export const NumberRendererCell: React.ComponentType<WidgetProps & StringRendererCellProps> = (props) => {
    return <StringRendererCell
        {...props}
        type={'number'}
    />
}

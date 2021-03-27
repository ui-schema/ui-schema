import React, { CSSProperties, EventHandler } from 'react'
import { useUID } from 'react-uid'
import { mapSchema, checkNativeValidity, WidgetProps, TransTitle } from '@ui-schema/ui-schema'
import { ValidityHelperText } from '../../Component/LocaleHelperText/LocaleHelperText'
import InputBase from '@material-ui/core/InputBase'
import Typography from '@material-ui/core/Typography'
import { convertStringToNumber } from '@ui-schema/ds-material/Utils/convertStringToNumber'
import { forbidInvalidNumber } from '@ui-schema/ds-material/Utils'

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
    inputProps?: {
        [key: string]: any
    }
    inputRef?: null | React.RefObject<any>
    labelledBy?: string
}

export const StringRendererCell: React.ComponentType<WidgetProps & StringRendererCellProps> = (
    {
        type,
        multiline, rows, rowsMax,
        storeKeys, ownKey, schema, value, onChange,
        showValidity, valid, errors, required,
        style,
        onClick, onFocus, onBlur, onKeyUp, onKeyDown, onKeyPress,
        inputProps = {}, inputRef: customInputRef,
        labelledBy,
    }
) => {
    const uid = useUID()
    // todo: this could break law-of-hooks
    const inputRef = customInputRef || React.useRef()

    const format = schema.get('format') as string | undefined
    const currentRef = inputRef.current

    inputProps = mapSchema(inputProps, schema)

    if (schema.get('type') === 'number' && typeof inputProps['step'] === 'undefined') {
        inputProps['step'] = 'any'
    }

    if (typeof labelledBy === 'string') {
        inputProps['aria-labelledby'] = labelledBy
    } else {
        inputProps['aria-labelledby'] = 'uis-' + uid
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
        {!labelledBy ? <Typography component={'span'} variant={'srOnly'} id={inputProps['aria-labelledby']}>
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
        </Typography> : null}
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
            onKeyPress={e => {
                const evt = e.nativeEvent
                if (!forbidInvalidNumber(evt, schema.get('type') as string)) {
                    onKeyPress && onKeyPress(evt)
                }
            }}
            style={style}
            onKeyDown={onKeyDown}
            onChange={(e) => {
                const val = e.target.value
                const schemaType = schema.get('type') as string
                const newVal = convertStringToNumber(val, schemaType)
                if (
                    (schemaType === 'number' || schemaType === 'integer')
                    && newVal === '' && e.target.validity.badInput
                ) {
                    // forbid saving/deleting of invalid number at all
                    return undefined
                }
                onChange(
                    storeKeys, ['value'],
                    () => ({value: newVal}),
                    schema.get('deleteOnEmpty') as boolean || required,
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

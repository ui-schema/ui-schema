import { WithScalarValue } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widgets'
import React from 'react'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { ValidityHelperText } from '@ui-schema/ds-bootstrap/Component/LocaleHelperText'

export interface StringRendererProps extends WidgetProps {
    multiline?: boolean
    type?: string
    rows?: number
}

export interface NumberRendererProps extends WidgetProps {
    type: string
}

export const convertStringToNumber = (value, type) => {
    if (type === 'number') {
        if (isNaN(value * 1)) {
            console.error('Invalid Type: input not a number in')
            return
        }
        return value === '' ? '' : value * 1
    }
    return value
}

const StringRenderer = ({schema, value, multiline = false, onChange, storeKeys, showValidity, required, errors, type, rows}: StringRendererProps & WithScalarValue) => {
    const format = schema.get('format')
    const uid = React.useId()

    let Renderer: 'input' | 'textarea' = 'input'
    if (multiline) {
        Renderer = 'textarea'
    }

    const classFormGroup = ['form-group']
    const classFormControl = ['form-control']
    if (showValidity && errors?.hasError()) {
        classFormControl.push('is-invalid')
    }
    if (showValidity && !errors?.hasError()) {
        classFormGroup.push('was-validated')
    }

    return <div className={classFormGroup.join(' ')}>
        <label htmlFor={'uis-' + uid}><TranslateTitle schema={schema} storeKeys={storeKeys}/></label>
        <Renderer
            className={classFormControl.join(' ')}
            type={format || type}
            required={required}
            rows={rows}
            value={typeof value === 'string' || typeof value === 'number' ? value : ''}
            onChange={(e) => {
                const val = e.target.value
                onChange({
                    storeKeys,
                    scopes: ['value'],
                    type: 'set',
                    data: {
                        value: convertStringToNumber(val, schema.get('type')),
                    },
                    schema,
                    required,
                })
            }}
        />
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>
}

const TextRenderer = ({schema, ...props}: StringRendererProps & WithScalarValue) => {
    return <StringRenderer
        {...props}
        schema={schema}
        rows={schema.getIn(['view', 'rows']) as number}
        multiline
    />
}


const NumberRenderer = ({schema, ...props}: NumberRendererProps & WithScalarValue) => {
    return <StringRenderer
        {...props}
        schema={schema}
        type={'number'}
    />
}

export { StringRenderer, NumberRenderer, TextRenderer }

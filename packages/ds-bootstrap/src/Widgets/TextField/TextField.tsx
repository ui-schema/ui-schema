import { WithOnChange, WithValuePlain } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widget'
import * as React from 'react'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { ValidityHelperText } from '@ui-schema/ds-bootstrap/Component/LocaleHelperText'

export interface StringRendererProps extends WidgetProps, WithValuePlain, WithOnChange {
    multiline?: boolean
    type?: string
    rows?: number
}

export interface NumberRendererProps extends WidgetProps, WithValuePlain, WithOnChange {
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

const StringRenderer = ({schema, value, multiline = false, onChange, keysToName, storeKeys, showValidity, required, errors, type, rows}: StringRendererProps) => {
    const format = schema.get('format')
    const uid = React.useId()

    let Renderer: 'input' | 'textarea' = 'input'
    if (multiline) {
        Renderer = 'textarea'
    }

    const classFormGroup: string[] = []
    const classFormControl = ['form-control']
    if (showValidity && errors?.size) {
        classFormControl.push('is-invalid')
    }
    if (showValidity && !errors?.size) {
        classFormGroup.push('was-validated')
    }

    return <div className={classFormGroup.join(' ')}>
        <label className={'form-label'} htmlFor={'uis-' + uid}><TranslateTitle schema={schema} storeKeys={storeKeys}/></label>
        <Renderer
            id={'uis-' + uid}
            className={classFormControl.join(' ')}
            type={format || type}
            required={required}
            rows={rows}
            name={keysToName?.(storeKeys)}
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

const TextRenderer = ({schema, ...props}: StringRendererProps) => {
    return <StringRenderer
        {...props}
        schema={schema}
        rows={schema.getIn(['view', 'rows']) as number}
        multiline
    />
}


const NumberRenderer = ({schema, ...props}: NumberRendererProps) => {
    return <StringRenderer
        {...props}
        schema={schema}
        type={'number'}
    />
}

export { StringRenderer, NumberRenderer, TextRenderer }

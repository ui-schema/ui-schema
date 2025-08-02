import { Required } from '@ui-schema/ds-bootstrap/Component'
import { WithOnChange, WithValuePlain } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widget'
import * as React from 'react'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { ValidityHelperText } from '@ui-schema/ds-bootstrap/Component/LocaleHelperText'

export interface WidgetPropsBoolean extends WidgetProps, WithValuePlain, WithOnChange {
}

const BoolRenderer = ({showValidity, required, errors, value, keysToName, storeKeys, onChange, schema}: WidgetPropsBoolean) => {
    const id = React.useId()
    const classForm = ['form-check', 'form-switch']
    const classLabel = ['form-check-label']
    const classFormControl = ['form-check-input']
    if (showValidity && errors?.size) {
        classFormControl.push('is-invalid')
    }
    if (showValidity && !errors?.size) {
        classForm.push('was-validated')
    }

    const currentChecked = !!value

    return <div className={classForm.join(' ')}>
        <input
            type="checkbox"
            className={classFormControl.join(' ')}
            id={'uis-' + id}
            role="switch"
            checked={currentChecked}
            required={required}
            name={keysToName?.(storeKeys)}
            onChange={() =>
                onChange({
                    storeKeys,
                    scopes: ['value'],
                    type: 'update',
                    updater: ({value: storeValue}) => ({value: !storeValue}),
                    schema,
                    required,
                })
            }
        />
        <label className={classLabel.join(' ')} htmlFor={'uis-' + id}>
            <TranslateTitle schema={schema} storeKeys={storeKeys}/>
            <Required required={required}/>
        </label>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>
}

export { BoolRenderer }

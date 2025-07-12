import { WidgetProps } from '@ui-schema/react/Widget'
import React from 'react'
import { Translate } from '@ui-schema/react/Translate'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { memo } from '@ui-schema/react/Utils/memo'
import { extractValue } from '@ui-schema/react/UIStore'
import { sortScalarList } from '@ui-schema/ui-schema/Utils/sortScalarList'
import { beautifyKey } from '@ui-schema/ui-schema/Utils/beautify'
import { List, Map } from 'immutable'
import { ValidityHelperText } from '@ui-schema/ds-bootstrap/Component/LocaleHelperText'

const CheckInput = ({checked, onChange, label, value, classForm, classLabel, classFormControl}: any) => {
    const uid = React.useId()

    return <div className={classForm}>
        <input
            id={'uis-' + uid}
            type="checkbox"
            className={classFormControl}
            value={value}
            checked={checked}
            onChange={onChange}/>
        <label
            className={classLabel}
            htmlFor={'uis-' + uid}
        >
            {label}
        </label>
    </div>
}
const checkActive = (list, name) => list && list.contains && typeof list.contains(name) !== 'undefined' ? list.contains(name) : false

const OptionsCheckValue = extractValue(memo(({oneOfValues, storeKeys, value, onChange, classLabel, classFormControl, classForm, schema, required}) => oneOfValues ?
    oneOfValues.map((oneOfSchema) => {
        const oneOfVal = oneOfSchema.get('const')
        const isActive = checkActive(value, oneOfVal)

        return <CheckInput
            key={oneOfVal}
            checked={isActive}
            classForm={classForm}
            classLabel={classLabel}
            classFormControl={classFormControl}
            currentValue={isActive}
            onChange={() => {
                onChange({
                    storeKeys,
                    scopes: ['value'],
                    type: 'update',
                    updater: ({value: val = List()}) =>
                        ({
                            value: sortScalarList(checkActive(val, oneOfVal) ?
                                val.delete(val.indexOf(oneOfVal)) :
                                val.push(oneOfVal)),
                        }),
                    schema,
                    required,
                })
            }}
            label={<Translate
                schema={oneOfSchema.get('t')}
                text={oneOfSchema.get('title') || oneOfSchema.get('const')}
                context={Map({'relative': List(['title'])})}
                fallback={oneOfSchema.get('title') || beautifyKey(oneOfSchema.get('const'), oneOfSchema.get('tt'))}
            />}
        />
    }).valueSeq()
    : null,
))

const OptionsCheck = ({schema, storeKeys, showValidity, errors, required}: WidgetProps) => {
    const oneOfVal = schema.getIn(['items', 'oneOf'])
    if (!oneOfVal) return null

    const classForm = ['form-check']
    const classLabel = ['form-check-label']
    const classFormControl = ['form-check-input']
    if (showValidity && errors?.size) {
        classFormControl.push('is-invalid')
    }
    if (showValidity && !errors?.size) {
        classForm.push('was-validated')
    }

    return <div>
        <label className="form-label d-block">
            <TranslateTitle schema={schema} storeKeys={storeKeys}/>
        </label>
        <OptionsCheckValue
            required={required}
            type={schema.get('type')}
            classForm={classForm.join(' ')}
            classLabel={classLabel.join(' ')}
            classFormControl={classFormControl.join(' ')}
            oneOfValues={oneOfVal} storeKeys={storeKeys} schema={schema}/>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>
}

export { OptionsCheck }

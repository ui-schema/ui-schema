import { Required } from '@ui-schema/ds-bootstrap/Component/Required'
import { WidgetProps } from '@ui-schema/react/Widget'
import * as React from 'react'
import { Translate } from '@ui-schema/react/Translate'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { sortScalarList } from '@ui-schema/ui-schema/Utils/sortScalarList'
import { beautifyKey } from '@ui-schema/ui-schema/Utils/beautify'
import { List, Map } from 'immutable'
import { ValidityHelperText } from '@ui-schema/ds-bootstrap/Component/LocaleHelperText'

const CheckInput = ({checked, onChange, label, value, storeKeys, keysToName, classForm, classLabel, classFormControl}: any) => {
    const uid = React.useId()

    return <div className={classForm}>
        <input
            id={'uis-' + uid}
            type="checkbox"
            className={classFormControl}
            value={value}
            checked={checked}
            onChange={onChange}
            name={keysToName?.(storeKeys)}
        />
        <label
            className={classLabel}
            htmlFor={'uis-' + uid}
        >
            {label}
        </label>
    </div>
}
const checkActive = (list, name) => list && list.contains && typeof list.contains(name) !== 'undefined' ? list.contains(name) : false

const OptionsCheckValue =
    ({oneOfValues, storeKeys, value, onChange, keysToName, classLabel, classFormControl, classForm, schema, required}) =>
        oneOfValues ?
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
                    storeKeys={storeKeys}
                    keysToName={keysToName}
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
            : null

const OptionsCheck = ({schema, storeKeys, showValidity, keysToName, onChange, value, errors, required}: WidgetProps) => {
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
            <Required required={required}/>
        </label>
        <OptionsCheckValue
            required={required}
            classForm={classForm.join(' ')}
            classLabel={classLabel.join(' ')}
            classFormControl={classFormControl.join(' ')}
            oneOfValues={oneOfVal}
            value={value}
            storeKeys={storeKeys}
            schema={schema}
            keysToName={keysToName}
            onChange={onChange}
        />

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>
}

export { OptionsCheck }

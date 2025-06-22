import { WithScalarValue } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widgets'
import React from 'react'
import { beautifyKey } from '@ui-schema/ui-schema/Utils/beautify'
import { Translate } from '@ui-schema/react/Translate'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { List, Map } from 'immutable'
import { ValidityHelperText } from '@ui-schema/ds-bootstrap/Component/LocaleHelperText'

const RadioInput = ({classForm, enumName, classLabel, required, classFormControl, value, onChange, storeKeys, label, schema}) => {
    const uid = React.useId()

    return <div
        className={classForm.join(' ')}
        key={enumName}>
        <input
            required={required}
            id={'uis-' + uid}
            type="radio"
            className={classFormControl.join(' ')}
            checked={enumName === value}
            onChange={() =>
                onChange({
                    storeKeys,
                    scopes: ['value'],
                    type: 'set',
                    data: {value: enumName},
                    schema,
                    required,
                })
            }
        />
        <label
            className={classLabel.join(' ')}
            htmlFor={'uis-' + uid}
        >
            {label}
        </label>
    </div>
}

const OptionsRadio = ({schema, value, onChange, storeKeys, showValidity, required, errors}: WidgetProps & WithScalarValue) => {
    const enumVal = schema.get('enum')
    if (!enumVal) return null

    const classForm = ['custom-control', 'custom-radio']
    const classLabel = ['custom-control-label', 'text-light']
    const classFormControl = ['custom-control-input']
    if (showValidity && errors?.size) {
        classFormControl.push('is-invalid')
    }
    if (showValidity && !errors?.size) {
        classForm.push('was-validated')
    }

    return <React.Fragment>
        <label><TranslateTitle schema={schema} storeKeys={storeKeys}/></label>
        {enumVal ? enumVal.map((enum_name) => {
            return <RadioInput
                key={enum_name}
                classForm={classForm}
                enumName={enum_name}
                classLabel={classLabel}
                required={required}
                classFormControl={classFormControl}
                value={value}
                onChange={onChange}
                storeKeys={storeKeys}
                schema={schema}
                label={<Translate
                    schema={schema.get('t')}
                    text={storeKeys.insert(0, 'widget').concat(List(['enum', enum_name])).join('.')}
                    context={Map({'relative': List(['enum', enum_name])})}
                    fallback={beautifyKey(enum_name, schema.get('ttEnum'))}
                />}
            />
        }).valueSeq() : null}

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
}

export { OptionsRadio }



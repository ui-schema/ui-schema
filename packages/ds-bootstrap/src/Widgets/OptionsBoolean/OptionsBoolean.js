import React from 'react';
import {useUID} from 'react-uid';
import {TranslateTitle} from '@ui-schema/react/TranslateTitle';
import {ValidityHelperText} from '../../Component/LocaleHelperText';

const BoolRenderer = ({showValidity, required, errors, value, storeKeys, onChange, schema}) => {
    const id = useUID()
    let classForm = ['custom-control', 'custom-switch'];
    let classLabel = ['custom-control-label', 'text-light'];
    let classFormControl = ['custom-control-input'];
    if(showValidity && errors.hasError()) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.hasError()) {
        classForm.push('was-validated');
    }

    let currentChecked = !!value;

    return <div className={classForm.join(' ')}>
        <input
            type="checkbox" className={classFormControl.join(' ')} id={'uis-' + id}
            checked={currentChecked}
            required={required}
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
        <label className={classLabel.join(' ')} htmlFor={'uis-' + id}><TranslateTitle schema={schema} storeKeys={storeKeys}/>{(required ? ' *' : '')}</label>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>;
};

export {BoolRenderer};

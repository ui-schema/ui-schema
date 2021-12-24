import React from 'react';
import {TransTitle} from '@ui-schema/ui-schema';
import {ValidityHelperText} from '../../Component/LocaleHelperText/LocaleHelperText';

const BoolRenderer = ({ownKey, showValidity, required, errors, value, storeKeys, onChange, schema}) => {

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
            type="checkbox" className={classFormControl.join(' ')} id={ownKey}
            checked={currentChecked}
            required={required}
            onChange={() =>
                onChange(
                    storeKeys, ['value'],
                    {
                        type: 'update',
                        updater: ({value: storeValue}) => ({value: !storeValue}),
                        schema,
                        required,
                    }
                )
            }
        />
        <label className={classLabel.join(' ')} htmlFor={ownKey}><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>{(required ? ' *' : '')}</label>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>;
};

export {BoolRenderer};

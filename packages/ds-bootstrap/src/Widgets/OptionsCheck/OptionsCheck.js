import React from 'react';
import {TransTitle, Trans, beautifyKey, extractValue, memo, sortScalarList} from '@ui-schema/ui-schema';
import {List, Map} from 'immutable';
import {useUID} from 'react-uid';
import {ValidityHelperText} from '../../Component/LocaleHelperText/LocaleHelperText';

const CheckInput = ({currentValue, onChange, label, value, classForm, classLabel, classFormControl}) => {
    const uid = useUID();

    return <div className={classForm}>
        <input
            id={'uis-' + uid}
            type="checkbox"
            className={classFormControl}
            value={value}
            checked={currentValue}
            onChange={onChange}/>
        <label
            className={classLabel}
            htmlFor={'uis-' + uid}
        >
            {label}
        </label>
    </div>
};
const checkActive = (list, name) => list && list.contains && typeof list.contains(name) !== 'undefined' ? list.contains(name) : false;

const OptionsCheckValue = extractValue(memo(({enumVal, storeKeys, value, onChange, classLabel, classFormControl, classForm, schema, required, type}) => enumVal ?
    enumVal.map((enum_name) => {
        const isActive = checkActive(value, enum_name)

        return <CheckInput
            key={enum_name}
            value={enum_name}
            classForm={classForm}
            classLabel={classLabel}
            classFormControl={classFormControl}
            currentValue={isActive}
            onChange={() => {
                onChange(
                    storeKeys, ['value'],
                    ({value: val = List()}) =>
                        ({
                            value: sortScalarList(checkActive(val, enum_name) ?
                                val.delete(val.indexOf(enum_name)) :
                                val.push(enum_name)),
                        }),
                    required,
                    type,
                )
            }}
            label={<Trans
                schema={schema.get('t')}
                text={storeKeys.insert(0, 'widget').concat(List(['enum', enum_name])).join('.')}
                context={Map({'relative': List(['enum', enum_name])})}
                fallback={beautifyKey(enum_name, schema.get('tt'))}
            />}
        />
    }).valueSeq()
    : null,
));

const OptionsCheck = ({schema, storeKeys, showValidity, errors, ownKey, required}) => {
    const enumVal = schema.get('enum');

    if(!enumVal) return null;

    let classForm = ['custom-control', 'custom-checkbox'];
    let classLabel = ['custom-control-label', 'text-light'];
    let classFormControl = ['custom-control-input', 'checkbox-inline'];
    if(showValidity && errors.hasError()) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.hasError()) {
        classForm.push('was-validated');
    }

    return <React.Fragment>
        <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
        <OptionsCheckValue
            required={required}
            type={schema.get('type')}
            classForm={classForm.join(' ')}
            classLabel={classLabel.join(' ')}
            classFormControl={classFormControl.join(' ')}
            enumVal={enumVal} storeKeys={storeKeys} schema={schema}/>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
};

export {OptionsCheck};

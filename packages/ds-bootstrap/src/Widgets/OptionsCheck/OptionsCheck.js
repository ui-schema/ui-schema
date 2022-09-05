import React from 'react';
import {Translate} from '@ui-schema/react/Translate';
import {TranslateTitle} from '@ui-schema/react/TranslateTitle';
import {memo} from '@ui-schema/react/Utils/memo';
import {extractValue} from '@ui-schema/react/UIStore';
import {sortScalarList} from '@ui-schema/system/Utils/sortScalarList';
import {beautifyKey} from '@ui-schema/system/Utils/beautify';
import {List, Map} from 'immutable';
import {useUID} from 'react-uid';
import {ValidityHelperText} from '../../Component/LocaleHelperText';

const CheckInput = ({checked, onChange, label, value, classForm, classLabel, classFormControl}) => {
    const uid = useUID();

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
};
const checkActive = (list, name) => list && list.contains && typeof list.contains(name) !== 'undefined' ? list.contains(name) : false;

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
));

const OptionsCheck = ({schema, storeKeys, showValidity, errors, required}) => {
    const oneOfVal = schema.getIn(['items', 'oneOf'])
    if(!oneOfVal) return null

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
        <TranslateTitle schema={schema} storeKeys={storeKeys}/>
        <OptionsCheckValue
            required={required}
            type={schema.get('type')}
            classForm={classForm.join(' ')}
            classLabel={classLabel.join(' ')}
            classFormControl={classFormControl.join(' ')}
            oneOfValues={oneOfVal} storeKeys={storeKeys} schema={schema}/>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
};

export {OptionsCheck};

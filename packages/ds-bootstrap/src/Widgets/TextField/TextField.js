import React from 'react';
import {TransTitle} from '@ui-schema/ui-schema';
import {ValidityHelperText} from '../../Component/LocaleHelperText/LocaleHelperText';
import {useUID} from 'react-uid';

export const convertStringToNumber = (value, type) => {
    if(type === 'number') {
        if(isNaN(value * 1)) {
            console.error('Invalid Type: input not a number in');
            return;
        }
        return value === '' ? '' : value * 1
    }
    return value
}

const StringRenderer = ({schema, value, multiline = false, onChange, storeKeys, showValidity, required, errors, type, rows}) => {
    const format = schema.get('format');
    const uid = useUID();

    let Renderer = 'input';
    if(multiline) {
        Renderer = 'textarea';
    }

    let classFormGroup = ['form-group'];
    let classFormControl = ['form-control'];
    if(showValidity && errors.hasError()) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.hasError()) {
        classFormGroup.push('was-validated');
    }

    return <div className={classFormGroup.join(' ')}>
        <label htmlFor={'uis-' + uid}><TransTitle schema={schema} storeKeys={storeKeys}/></label>
        <Renderer
            className={classFormControl.join(' ')}
            type={format || type}
            required={required}
            rows={rows}
            value={typeof value !== 'undefined' ? value : ''}
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
    </div>;
};

const TextRenderer = ({schema, ...props}) => {
    return <StringRenderer
        {...props}
        schema={schema}
        rows={schema.getIn(['view', 'rows'])}
        multiline
    />
};


const NumberRenderer = ({schema, ...props}) => {
    return <StringRenderer
        {...props}
        schema={schema}
        type={'number'}
    />
};

export {StringRenderer, NumberRenderer, TextRenderer};

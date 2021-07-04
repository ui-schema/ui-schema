import React from 'react';
import {TransTitle, extractValue, memo, PluginStack} from '@ui-schema/ui-schema';
import {List} from 'immutable';
import {ValidityHelperText} from '../../Component/LocaleHelperText/LocaleHelperText';
import {IconPlus, IconMinus} from '@ui-schema/ds-bootstrap/Component/Icons/Icons';

const SimpleList = extractValue(memo(({
                                          storeKeys, ownKey, schema, value, onChange,
                                          showValidity, errors, required,
                                      }) => {

    let btnSize = schema.getIn(['view', 'btnSize']) || 'small';

    let classFormGroup = ['form-group', 'd-flex', 'align-items-center'];
    let classFormControl = ['form-control'];
    if(showValidity && errors.hasError()) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.hasError()) {
        classFormGroup.push('was-validated');
    }

    return <React.Fragment>
        <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
        <div>
            {value ? value.map((val, i) =>
                <div
                    key={i}
                    className={classFormGroup.join(' ')}>
                    <PluginStack
                        className={classFormControl.join(' ')}
                        showValidity={showValidity}
                        storeKeys={storeKeys.push(i)}
                        parentSchema={schema}
                        schema={schema.get('items')}
                        required={required}
                        noGrid
                    />
                    <div>
                        <IconMinus
                            btnSize={btnSize}
                            onClick={() => {
                                onChange(
                                    storeKeys, ['value'],
                                    ({value: storeValue}) => ({value: storeValue.splice(i, 1)}),
                                    schema.get('deleteOnEmpty') || required,
                                    schema.get('type'),
                                )
                            }}/>
                    </div>
                </div>,
            ).valueSeq() : null}
            <div>
                <IconPlus
                    btnSize={btnSize}
                    onClick={() => {
                        onChange(
                            storeKeys, ['value'],
                            ({value: storeValue = List()}) => ({value: storeValue.push('')}),
                            schema.get('deleteOnEmpty') || required,
                            schema.get('type'),
                        )
                    }}/>
            </div>
        </div>
        <ValidityHelperText
            /* only pass down errors which are not for a specific sub-schema */
            errors={errors}
            showValidity={showValidity}
            schema={schema}
        />
    </React.Fragment>
}));

export {SimpleList};

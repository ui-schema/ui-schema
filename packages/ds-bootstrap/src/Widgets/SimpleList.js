import React from "react";
import {NestedSchemaEditor, TransTitle, extractValue, memo, updateValue} from "@ui-schema/ui-schema";
import {List} from 'immutable';
import {ValidityHelperText} from "../Component/LocaleHelperText";
import {IconPlus, IconMinus} from "@ui-schema/ds-bootstrap/Component/Icons";


const SimpleList = extractValue(memo(({
                                          storeKeys, ownKey, schema, value, onChange,
                                          showValidity, errors, required
                                      }) => {
    let btnSize = 1;
    const btnSizeSchema = schema.getIn(['view', 'btnSize']) || 'small';
    switch(btnSizeSchema) {
        case("small"):
            btnSize = 0.5;
            break;
        case("medium"):
            btnSize = 1;
            break;
        case("big"):
            btnSize = 2;
            break;
    }

    let classFormGroup = ["form-group", "d-flex", "align-items-center"];
    let classFormControl = ["form-control"];
    if(showValidity && errors.size) {
        classFormControl.push('is-invalid');
    }
    if(showValidity && !errors.size) {
        classFormGroup.push('was-validated');
    }

    return <React.Fragment>
        <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
        <div>
            {value ? value.map((val, i) =>
                <div
                    key={i}
                    className={classFormGroup.join(' ')}>
                    <NestedSchemaEditor
                        className={classFormControl.join(' ')}
                        showValidity={showValidity}
                        storeKeys={storeKeys.push(i)}
                        schema={schema.get('items')}
                        required={required}
                        noGrid
                    />
                    <div>
                        <IconMinus
                            btnSize={btnSize}
                            onClick={() => {
                                onChange(updateValue(storeKeys, value.splice(i, 1)))
                            }}/>
                    </div>
                </div>
            ).valueSeq() : null}
            <div>
            <IconPlus
                btnSize={btnSize}
                onClick={() => {
                    onChange(updateValue(storeKeys, value ? value.push('') : List([''])))
                }}/>
            </div>
        </div>
        <ValidityHelperText
            /* only pass down errors which are not for a specific sub-schema */
            errors={errors.filter(err => List.isList(err) ? !err.getIn([1, 'arrayItems']) : true)}
            showValidity={showValidity}
            schema={schema}
        />
    </React.Fragment>
}));

export {SimpleList};

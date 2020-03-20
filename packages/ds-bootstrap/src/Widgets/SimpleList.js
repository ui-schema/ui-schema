import React from "react";
import {NestedSchemaEditor, TransTitle, extractValue, memo, updateValue} from "@ui-schema/ui-schema";
import {List} from 'immutable';
import {ValidityHelperText} from "../../../ds-material/src/Component/LocaleHelperText";


const SimpleList = extractValue(memo(({
                                          storeKeys, ownKey, schema, value, onChange,
                                          showValidity, errors, required
                                      }) => {
    let btnPx = 32;
    const btnSize = schema.getIn(['view', 'btnSize']) || 'small';
    switch(btnSize) {
        case("small"):
            btnPx = 18;
            break;
        case("medium"):
            btnPx = 24;
            break;
        case("big"):
            btnPx = 42;
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
                    <svg className={["bi", "bi-dash-circle", "mx-3"].join(' ')} width={btnPx} height={btnPx} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                        onClick={() => {
                             onChange(updateValue(storeKeys, value.splice(i, 1)))
                         }}>
                        <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M3.5 8a.5.5 0 01.5-.5h8a.5.5 0 010 1H4a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
                    </svg>
                </div>
            ).valueSeq() : null}
            <svg className="bi bi-plus" width={btnPx} height={btnPx} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                     onChange(updateValue(storeKeys, value ? value.push('') : List([''])))
                 }}>
                <path fillRule="evenodd" d="M10 5.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H6a.5.5 0 010-1h3.5V6a.5.5 0 01.5-.5z" clipRule="evenodd"/>
                <path fillRule="evenodd" d="M9.5 10a.5.5 0 01.5-.5h4a.5.5 0 010 1h-3.5V14a.5.5 0 01-1 0v-4z" clipRule="evenodd"/>
            </svg>
        </div>
        <ValidityHelperText
            /* only pass down errors which are not for a specific sub-schema */
            errors={errors.filter(err => List.isList(err) ? !err.getIn([1, 'arrayItems']) : true)}
            showValidity={showValidity}
            schema={schema}
        />
    </React.Fragment>

    /*  */
}));

export {SimpleList,};

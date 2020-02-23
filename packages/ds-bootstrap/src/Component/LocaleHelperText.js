import React from "react";
import {Trans} from "@ui-schema/ui-schema";
import {List} from 'immutable'

const LocaleHelperText = ({text, schema, context, className}) => {
    return <div className={className}>
        <Trans text={text} context={
            context ? context.set('type', schema.get('type'))
                .set('widget', schema.get('widget')) : undefined
        }/>
    </div>
};

const ValidityHelperText = ({showValidity, errors, schema}) =>
    showValidity && errors.size ?
        errors.map((error, i) =>
            <LocaleHelperText
                key={i} schema={schema} className={"invalid-feedback"}
                text={'error.' + (List.isList(error) ? error.get(0) : error)}
                context={List.isList(error) ? error.get(1) : undefined}
            />
        ).valueSeq()
        : null;

export {LocaleHelperText, ValidityHelperText}

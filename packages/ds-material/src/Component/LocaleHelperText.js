import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import {Trans} from "@ui-schema/ui-schema";
import {List} from 'immutable'

const LocaleHelperText = ({text, schema, context, error = false}) => {
    return <FormHelperText error={error}>
        {schema.get('t') === 'browser' && context && context.get('browserMessage') ?
            context.get('browserMessage') :
            <Trans text={text} context={
                context ? context.set('type', schema.get('type'))
                    .set('widget', schema.get('widget')) : undefined
            }/>}
    </FormHelperText>
};

const ValidityHelperText = ({showValidity, errors, schema}) =>
    showValidity && errors.size ?
        errors.map((error, i) =>
            <LocaleHelperText
                key={i} schema={schema} error
                text={'error.' + (List.isList(error) ? error.get(0) : error)}
                context={List.isList(error) ? error.get(1) : undefined}
            />
        ).valueSeq()
        : null;

export {LocaleHelperText, ValidityHelperText}

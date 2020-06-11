import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import {Trans} from "@ui-schema/ui-schema";
import {List} from 'immutable'

const LocaleHelperText = ({text, schema, context, error = false}) => {
    return <FormHelperText error={error}>
        <Trans text={text} context={
            context ? context.set('type', schema.get('type'))
                .set('widget', schema.get('widget')) : undefined
        }/>
    </FormHelperText>
};

const ValidityHelperText = ({showValidity, errors, schema, browserError}) =>
    schema.get('t') === 'browser' && browserError ?
        <FormHelperText error>
            {browserError}
        </FormHelperText> :
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

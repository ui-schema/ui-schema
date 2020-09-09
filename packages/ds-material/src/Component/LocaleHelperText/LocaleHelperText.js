import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import {Trans} from "@ui-schema/ui-schema";

const LocaleHelperText = ({text, schema, context, error = false}) => {
    return <FormHelperText error={error}>
        <Trans text={text} context={
            context ? context.set('type', schema.get('type'))
                .set('widget', schema.get('widget')) : undefined
        }/>
    </FormHelperText>
};

/**
 *
 * @param showValidity
 * @param errors
 * @param schema
 * @param browserError
 * @return {JSX.Element|Immutable.Seq.Indexed<any>|null}
 * @constructor
 */
const ValidityHelperText = ({showValidity, errors, schema, browserError}) =>
    schema.get('t') === 'browser' && browserError ?
        <FormHelperText error>
            {browserError}
        </FormHelperText> :
        showValidity && errors.hasError() ?
            errors.getErrors().keySeq().map((type) =>
                errors.getError(type).map((err, i) =>
                    <LocaleHelperText
                        key={type + '.' + i} schema={schema} error
                        text={'error.' + type}
                        context={err}
                    />
                )
            ).valueSeq()
            : null;

export {LocaleHelperText, ValidityHelperText}

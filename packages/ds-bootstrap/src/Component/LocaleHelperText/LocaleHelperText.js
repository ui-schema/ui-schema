import React from 'react';
import {Trans} from '@ui-schema/ui-schema';

const LocaleHelperText = ({text, schema, context, className}) => {
    return <div className={className}>
        <Trans text={text} context={
            context ? context.set('type', schema.get('type'))
                .set('widget', schema.get('widget')) : undefined
        }/>
    </div>
};

const ValidityHelperText = ({showValidity, errors, schema}) =>
    showValidity && errors.hasError() ?
        errors.getErrors().keySeq().map((type) =>
            errors.getError(type).map((err, i) =>
                <LocaleHelperText
                    key={type + '.' + i}
                    schema={schema}
                    className={'invalid-feedback'}
                    text={'error.' + type}
                    context={err}
                />,
            ),
        ).valueSeq()
        : null;

export {LocaleHelperText, ValidityHelperText}

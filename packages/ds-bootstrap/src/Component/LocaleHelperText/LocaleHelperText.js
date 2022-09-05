import React from 'react';
import {Translate} from '@ui-schema/react/Translate';

const LocaleHelperText = ({text, schema, context, className}) => {
    return <div className={className}>
        <Translate text={text} context={
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

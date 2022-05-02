import React from 'react'
import FormHelperText from '@mui/material/FormHelperText'
import { Trans } from '@ui-schema/ui-schema/Translate/Trans'
import { showValidity, Errors, StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export interface ValidityHelperTextProps {
    showValidity: showValidity | undefined
    errors?: Errors
    schema: StoreSchemaType
    browserError?: Node | React.ReactElement
}

export interface LocaleHelperTextProps {
    text: string
    schema: StoreSchemaType
    context?: any
    error?: boolean
}

export const LocaleHelperText: React.FC<LocaleHelperTextProps> = (
    {
        text, schema, context, error = false,
    },
) => {
    return <FormHelperText error={error}>
        <Trans text={text} context={
            context ? context.set('type', schema.get('type'))
                .set('widget', schema.get('widget')) : undefined
        }/>
    </FormHelperText>
}

export const ValidityHelperText: React.FC<ValidityHelperTextProps> = (
    {
        showValidity, errors, schema, browserError,
    },
) =>
    (schema.get('t') === 'browser' && browserError ?
        <FormHelperText error>
            {browserError}
        </FormHelperText> :
        showValidity && errors && errors.hasError() ?
            errors.getErrors().keySeq().map((type) =>
                errors.getError(type).map((err, i) =>
                    <LocaleHelperText
                        key={type + '.' + i} schema={schema} error
                        text={'error.' + type}
                        context={err}
                    />,
                ),
            ).valueSeq()
            : null) as unknown as React.ReactElement

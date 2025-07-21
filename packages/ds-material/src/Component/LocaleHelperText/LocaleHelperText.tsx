import { ValidationErrorsImmutable } from '@ui-schema/ui-schema/ValidatorOutput'
import * as React from 'react'
import FormHelperText from '@mui/material/FormHelperText'
import { Translate } from '@ui-schema/react/Translate'
import { showValidity } from '@ui-schema/ui-schema/CommonTypings'
import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'

export interface ValidityHelperTextProps {
    showValidity: showValidity | undefined
    errors: ValidationErrorsImmutable | undefined
    schema: SomeSchema
    browserError?: React.ReactNode | React.ReactElement
}

export interface LocaleHelperTextProps {
    text: string
    schema: SomeSchema
    context?: any
    error?: boolean
}

export const LocaleHelperText: React.FC<LocaleHelperTextProps> = (
    {
        text, schema, context, error = false,
    },
) => {
    return <FormHelperText error={error}>
        <Translate text={text} context={
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
    (schema.get('tBy') === 'browser' && browserError ?
        <FormHelperText error>
            {browserError}
        </FormHelperText> :
        showValidity && errors?.size ?
            errors.map((err, i) =>
                <LocaleHelperText
                    key={err.get('error') + '.' + i} schema={schema} error
                    text={'error.' + err.get('error')}
                    context={err.get('context')}
                />,
            ).valueSeq()
            : null) as unknown as React.ReactElement

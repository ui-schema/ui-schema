import React from 'react'
import FormHelperText from '@mui/material/FormHelperText'
import { Translate } from '@ui-schema/react/Translate'
import { showValidity } from '@ui-schema/system/CommonTypings'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export interface ValidityHelperTextProps {
    showValidity: showValidity | undefined
    errors?: ValidatorErrorsType
    schema: UISchemaMap
    browserError?: Node | React.ReactElement
}

export interface LocaleHelperTextProps {
    text: string
    schema: UISchemaMap
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

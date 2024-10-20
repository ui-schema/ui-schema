import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'
import { Map } from 'immutable'
import React from 'react'
import { Translate } from '@ui-schema/react/Translate'

export interface ValidityHelperTextProps {
    showValidity: boolean | undefined
    errors?: ValidatorErrorsType
    schema: UISchemaMap
}

export interface LocaleHelperTextProps {
    text: string
    schema: UISchemaMap
    context?: Map<any, any>
    className?: string
}

const LocaleHelperText = ({text, schema, context, className}: LocaleHelperTextProps) => {
    return <div className={className}>
        <Translate text={text} context={
            context ? context.set('type', schema.get('type'))
                .set('widget', schema.get('widget')) : undefined
        }/>
    </div>
}

const ValidityHelperText = ({showValidity, errors, schema}: ValidityHelperTextProps) =>
    showValidity && errors?.hasError() ?
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
        : null

export { LocaleHelperText, ValidityHelperText }

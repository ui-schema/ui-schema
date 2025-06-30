import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { ValidationErrorsImmutable } from '@ui-schema/ui-schema/ValidatorOutput'
import { Map } from 'immutable'
import { Translate } from '@ui-schema/react/Translate'

export interface ValidityHelperTextProps {
    showValidity: boolean | undefined
    errors: ValidationErrorsImmutable | undefined
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
    showValidity && errors?.size ?
        errors.map((err, i) =>
            <LocaleHelperText
                key={err.get('error') + '.' + i} schema={schema}
                text={'error.' + err.get('error')}
                context={err.get('context')}
                className={'invalid-feedback'}
            />,
        ).valueSeq()
        : null

export { LocaleHelperText, ValidityHelperText }

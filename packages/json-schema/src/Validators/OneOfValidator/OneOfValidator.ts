import { ValidatorParams, ValidatorState, ValidatorHandler } from '@ui-schema/json-schema/Validator'
import { ValidatorOutput } from '@ui-schema/ui-schema/ValidatorOutput'
import { List } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export const ERROR_ONE_OF_INVALID = 'one-of-is-invalid'

export const validateOneOf = (
    oneOfSchemas: List<UISchemaMap>,
    value: any,
    params: ValidatorParams & ValidatorState,
) => {
    let errorCount = 0
    const output = new ValidatorOutput()
    if (List.isList(oneOfSchemas)) {
        // todo: oneOf should only validate to exactly one; yet that increases performance profile unnecessarily(?)
        for (const schema of oneOfSchemas) {
            const result = params.validate(
                schema,
                value,
                {
                    ...params,
                    keywordLocation: [...params.keywordLocation, 'oneOf'],
                    output: new ValidatorOutput(),
                    context: {},
                },
            )
            if (result.valid) {
                errorCount = 0
                // todo: merge contexts
                break
            } else {
                errorCount++
                result.errors.forEach(err => output.addError(err))
            }
        }
    }

    if (errorCount) {
        // todo: instead of adding `errors` directly, it should be a new error for `oneOf`,
        //       which contains the errors itself? (check last part against spec)
        output.errors.forEach(err => params.output.addError(err))
    }

    return {
        errorCount,
    }
}

export const oneOfValidator: ValidatorHandler = {
    validate: (schema, value, params) => {
        const oneOfSchemas = schema?.get('oneOf')
        if (!oneOfSchemas) return
        validateOneOf(oneOfSchemas, value, {...params, recursive: true})
    },
}

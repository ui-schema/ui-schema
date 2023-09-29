import { List, Map } from 'immutable'
import { validateSchema } from '@ui-schema/system/validateSchema'
import { createValidatorErrors } from '@ui-schema/system/ValidatorErrors'
import { UISchemaMap } from '@ui-schema/system/Definitions'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'

export const ERROR_ONE_OF_INVALID = 'one-of-is-invalid'

export const validateOneOf = (oneOfSchemas: List<UISchemaMap>, value: any, recursively: boolean = false) => {
    let errors = createValidatorErrors()
    let errorCount = 0
    if (
        (List.isList(oneOfSchemas) || Array.isArray(oneOfSchemas))
    ) {
        const schemas = List.isList(oneOfSchemas) ? oneOfSchemas.toArray() : oneOfSchemas
        for (const schema of schemas) {
            const tmpErr = validateSchema(schema as unknown as UISchemaMap, value, recursively)
            if (tmpErr.hasError()) {
                errors = errors.addErrors(tmpErr)
                errorCount++
            } else {
                errors = createValidatorErrors()
                errorCount = 0
                break
            }
        }
    }

    return {
        errors,
        errorCount,
    }
}

export const oneOfValidator: SchemaPlugin = {
    should: ({schema}) => {
        return List.isList(schema?.get('oneOf'))
    },
    handle: ({schema, value, errors, valid}) => {
        const oneOfSchemas = schema?.get('oneOf')
        if (oneOfSchemas) {
            const tmpErrors = validateOneOf(oneOfSchemas, value)
            if (tmpErrors.errorCount > 0) {
                valid = false
                errors = errors?.addChildErrors(tmpErrors.errors)
                errors = errors?.addError(ERROR_ONE_OF_INVALID, schema as Map<string, any>)
            }
        }
        return {errors, valid}
    },
}

import { ERROR_MAX_LENGTH, ERROR_MIN_LENGTH } from './MinMaxValidatorErrorCodes.js'
import { ValidatorOutput } from '@ui-schema/system/ValidatorOutput'
import { List } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export const validateMinMaxArray = (
    schema: UISchemaMap,
    value: any,
    output: ValidatorOutput,
): void => {
    if (typeof value === 'undefined') return

    const minItems = schema.get('minItems')
    const maxItems = schema.get('maxItems')

    if (minItems) {
        if (List.isList(value)) {
            if (value.size < minItems) {
                output.addError({error: ERROR_MIN_LENGTH, context: {min: minItems}})
            }
        } else if (Array.isArray(value)) {
            if (value.length < minItems) {
                output.addError({error: ERROR_MIN_LENGTH, context: {min: minItems}})
            }
        }
    }

    if (maxItems) {
        if (List.isList(value)) {
            if (value.size > maxItems) {
                output.addError({error: ERROR_MAX_LENGTH, context: {max: maxItems}})
            }
        } else if (Array.isArray(value)) {
            if (value.length > maxItems) {
                output.addError({error: ERROR_MAX_LENGTH, context: {max: maxItems}})
            }
        }
    }
}

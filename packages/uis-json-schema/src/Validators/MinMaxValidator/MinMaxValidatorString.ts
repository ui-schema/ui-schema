import { ERROR_MAX_LENGTH, ERROR_MIN_LENGTH } from './MinMaxValidatorErrorCodes.js'
import { ValidatorOutput } from '@ui-schema/system/ValidatorOutput'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export const validateMinMaxString = (
    schema: UISchemaMap,
    value: any,
    output: ValidatorOutput,
): void => {
    if (typeof value === 'undefined') return

    if (typeof value === 'string') {
        const minLength = schema.get('minLength')
        const maxLength = schema.get('maxLength')
        if (minLength) {
            if (value.length < minLength) {
                output.addError({
                    error: ERROR_MIN_LENGTH,
                    context: {min: minLength},
                })
            }
        }
        if (maxLength) {
            if (value.length > maxLength) {
                output.addError({
                    error: ERROR_MAX_LENGTH,
                    context: {max: maxLength},
                })
            }
        }
    }
}

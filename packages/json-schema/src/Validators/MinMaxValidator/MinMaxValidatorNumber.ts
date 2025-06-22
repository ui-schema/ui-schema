import { ERROR_MAX_LENGTH, ERROR_MIN_LENGTH } from './MinMaxValidatorErrorCodes.js'
import { ValidatorOutput } from '@ui-schema/ui-schema/ValidatorOutput'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export const validateMinMaxNumber = (
    schema: UISchemaMap,
    value: any,
    output: ValidatorOutput,
): void => {
    if (typeof value === 'undefined') return

    const minimum = schema.get('minimum')
    const exclusiveMinimum = schema.get('exclusiveMinimum')
    const maximum = schema.get('maximum')
    const exclusiveMaximum = schema.get('exclusiveMaximum')

    if (typeof value === 'number') {
        if (typeof minimum === 'number') {
            if (typeof exclusiveMinimum === 'boolean') {
                if (exclusiveMinimum && value <= minimum) {
                    output.addError({error: ERROR_MIN_LENGTH, context: {exclMin: minimum}})
                }
            } else if (value < minimum) {
                output.addError({error: ERROR_MIN_LENGTH, context: {min: minimum}})
            }
        }

        if (typeof exclusiveMinimum === 'number') {
            if (value <= exclusiveMinimum) {
                output.addError({error: ERROR_MIN_LENGTH, context: {exclMin: exclusiveMinimum}})
            }
        }
        if (typeof maximum === 'number') {
            if (typeof exclusiveMaximum === 'boolean') {
                if (value >= maximum) {
                    output.addError({error: ERROR_MAX_LENGTH, context: {exclMax: maximum}})
                }
            } else if (value > maximum) {
                output.addError({error: ERROR_MAX_LENGTH, context: {max: maximum}})
            }
        }
        if (typeof exclusiveMaximum === 'number') {
            if (value >= exclusiveMaximum) {
                output.addError({error: ERROR_MAX_LENGTH, context: {exclMax: exclusiveMaximum}})
            }
        }
    }
}

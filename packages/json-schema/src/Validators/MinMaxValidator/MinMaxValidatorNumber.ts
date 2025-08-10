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

    // Later drafts:
    // x ≥ minimum
    // x > exclusiveMinimum
    // x ≤ maximum
    // x < exclusiveMaximum

    // In JSON Schema Draft 4, exclusiveMinimum and exclusiveMaximum work differently. There they are boolean values, that indicate whether minimum and maximum are exclusive of the value. For example:
    //
    // if exclusiveMinimum is false, x ≥ minimum
    // if exclusiveMinimum is true, x > minimum
    //
    // if exclusiveMaximum is false, x ≤ maximum
    // if exclusiveMaximum is true, x < maximum

    if (typeof value === 'number') {
        if (typeof minimum === 'number') {
            if (typeof exclusiveMinimum === 'boolean') {
                if (exclusiveMinimum && value <= minimum) {
                    output.addError({error: ERROR_MIN_LENGTH, context: {exclMin: minimum}})
                } else if (!exclusiveMinimum && value < minimum) {
                    output.addError({error: ERROR_MIN_LENGTH, context: {min: minimum}})
                }
            } else if (value < minimum) {
                // Draft 6+ behavior for minimum
                output.addError({error: ERROR_MIN_LENGTH, context: {min: minimum}})
            }
        }

        if (typeof exclusiveMinimum === 'number') {
            // Draft 6+ behavior for exclusiveMinimum
            if (value <= exclusiveMinimum) {
                output.addError({error: ERROR_MIN_LENGTH, context: {exclMin: exclusiveMinimum}})
            }
        }

        if (typeof maximum === 'number') {
            if (typeof exclusiveMaximum === 'boolean') {
                if (exclusiveMaximum && value >= maximum) {
                    output.addError({error: ERROR_MAX_LENGTH, context: {exclMax: maximum}})
                } else if (!exclusiveMaximum && value > maximum) {
                    output.addError({error: ERROR_MAX_LENGTH, context: {max: maximum}})
                }
            } else if (value > maximum) {
                // Draft 6+ behavior for maximum
                output.addError({error: ERROR_MAX_LENGTH, context: {max: maximum}})
            }
        }

        if (typeof exclusiveMaximum === 'number') {
            // Draft 6+ behavior for exclusiveMaximum
            if (value >= exclusiveMaximum) {
                output.addError({error: ERROR_MAX_LENGTH, context: {exclMax: exclusiveMaximum}})
            }
        }
    }
}

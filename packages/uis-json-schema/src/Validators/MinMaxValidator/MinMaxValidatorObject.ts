import { ERROR_MAX_LENGTH, ERROR_MIN_LENGTH } from './MinMaxValidatorErrorCodes.js'
import { ValidatorOutput } from '@ui-schema/system/ValidatorOutput'
import { Map, Record } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export const validateMinMaxObject = (
    schema: UISchemaMap,
    value: any,
    output: ValidatorOutput,
): void => {
    if (typeof value === 'undefined') return

    const minProperties = schema.get('minProperties')
    const maxProperties = schema.get('maxProperties')

    if (minProperties) {
        if (Map.isMap(value) || Record.isRecord(value)) {
            if ((value.toSeq().keySeq().size || 0) < minProperties) {
                output.addError({error: ERROR_MIN_LENGTH, context: {min: minProperties}})
            }
        } else if (typeof value === 'object') {
            if (Object.keys(value).length < minProperties) {
                output.addError({error: ERROR_MIN_LENGTH, context: {min: minProperties}})
            }
        }
    }

    if (maxProperties) {
        if (Map.isMap(value) || Record.isRecord(value)) {
            if ((value.toSeq().keySeq().size || 0) > maxProperties) {
                output.addError({error: ERROR_MAX_LENGTH, context: {max: maxProperties}})
            }
        } else if (typeof value === 'object') {
            if (Object.keys(value).length > maxProperties) {
                output.addError({error: ERROR_MAX_LENGTH, context: {max: maxProperties}})
            }
        }
    }
}

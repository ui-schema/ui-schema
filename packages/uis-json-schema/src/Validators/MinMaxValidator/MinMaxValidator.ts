import { List, Map, Record } from 'immutable'
import { createValidatorErrors, ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'

export const ERROR_MIN_LENGTH = 'min-length'
export const ERROR_MAX_LENGTH = 'max-length'

export const validateMinMax = (schema: UISchemaMap, value: any): ValidatorErrorsType => {
    let errors = createValidatorErrors()
    if (typeof value === 'undefined') return errors

    if (typeof value === 'string') {
        const minLength = schema.get('minLength')
        const maxLength = schema.get('maxLength')
        if (minLength) {
            if (value.length < minLength) {
                errors = errors.addError(ERROR_MIN_LENGTH, Map({min: minLength}))
            }
        }
        if (maxLength) {
            if (value.length > maxLength) {
                errors = errors.addError(ERROR_MAX_LENGTH, Map({max: maxLength}))
            }
        }
    }

    const minItems = schema.get('minItems')
    const maxItems = schema.get('maxItems')

    if (minItems) {
        if (List.isList(value)) {
            if (value.size < minItems) {
                errors = errors.addError(ERROR_MIN_LENGTH, Map({min: minItems}))
            }
        } else if (Array.isArray(value)) {
            if (value.length < minItems) {
                errors = errors.addError(ERROR_MIN_LENGTH, Map({min: minItems}))
            }
        }
    }

    if (maxItems) {
        if (List.isList(value)) {
            if (value.size > maxItems) {
                errors = errors.addError(ERROR_MAX_LENGTH, Map({max: maxItems}))
            }
        } else if (Array.isArray(value)) {
            if (value.length > maxItems) {
                errors = errors.addError(ERROR_MAX_LENGTH, Map({max: maxItems}))
            }
        }
    }

    const minProperties = schema.get('minProperties')
    const maxProperties = schema.get('maxProperties')

    if (minProperties) {
        if (Map.isMap(value) || Record.isRecord(value)) {
            if ((value.toSeq().keySeq().size || 0) < minProperties) {
                errors = errors.addError(ERROR_MIN_LENGTH, Map({min: minProperties}))
            }
        } else if (typeof value === 'object') {
            if (Object.keys(value).length < minProperties) {
                errors = errors.addError(ERROR_MIN_LENGTH, Map({min: minProperties}))
            }
        }
    }

    if (maxProperties) {
        if (Map.isMap(value) || Record.isRecord(value)) {
            if ((value.toSeq().keySeq().size || 0) > maxProperties) {
                errors = errors.addError(ERROR_MAX_LENGTH, Map({max: maxProperties}))
            }
        } else if (typeof value === 'object') {
            if (Object.keys(value).length > maxProperties) {
                errors = errors.addError(ERROR_MAX_LENGTH, Map({max: maxProperties}))
            }
        }
    }

    const minimum = schema.get('minimum')
    const exclusiveMinimum = schema.get('exclusiveMinimum')
    const maximum = schema.get('maximum')
    const exclusiveMaximum = schema.get('exclusiveMaximum')

    if (typeof value === 'number') {
        if (typeof minimum === 'number') {
            if (typeof exclusiveMinimum === 'boolean') {
                if (exclusiveMinimum && value <= minimum) {
                    errors = errors.addError(ERROR_MIN_LENGTH, Map({exclMin: minimum}))
                }
            } else if (value < minimum) {
                errors = errors.addError(ERROR_MIN_LENGTH, Map({min: minimum}))
            }
        }

        if (typeof exclusiveMinimum === 'number') {
            if (value <= exclusiveMinimum) {
                errors = errors.addError(ERROR_MIN_LENGTH, Map({exclMin: exclusiveMinimum}))
            }
        }
        if (typeof maximum === 'number') {
            if (typeof exclusiveMaximum === 'boolean') {
                if (value >= maximum) {
                    errors = errors.addError(ERROR_MAX_LENGTH, Map({exclMax: maximum}))
                }
            } else if (value > maximum) {
                errors = errors.addError(ERROR_MAX_LENGTH, Map({max: maximum}))
            }
        }
        if (typeof exclusiveMaximum === 'number') {
            if (value >= exclusiveMaximum) {
                errors = errors.addError(ERROR_MAX_LENGTH, Map({exclMax: exclusiveMaximum}))
            }
        }
    }

    return errors
}

export const minMaxValidator: SchemaPlugin = {
    handle: ({schema, value, errors, valid}) => {
        const err = validateMinMax(schema, value)

        if (err.hasError()) {
            valid = false
            errors = errors.addErrors(err)
        }
        return {errors, valid}
    },
}

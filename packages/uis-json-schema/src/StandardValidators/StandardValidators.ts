import { ValidatorHandler, getValueType } from '@ui-schema/json-schema/Validator'
import {
    ERROR_CONST_MISMATCH,
    ERROR_ENUM_MISMATCH,
    ERROR_MULTIPLE_OF,
    ERROR_PATTERN,
    ERROR_WRONG_TYPE,
    validateConst, validateContains,
    validateEnum,
    validateMultipleOf,
    validatePattern,
    arrayValidator,
    objectValidator, oneOfValidator, validateTypes, ERROR_NOT_SET, ERROR_EMAIL_INVALID,
    validateEmail,
    validateMinMaxString, validateMinMaxNumber, validateMinMaxArray, validateMinMaxObject,
} from '@ui-schema/json-schema/Validators'
import { List, Map, Record } from 'immutable'

export const standardValidators: ValidatorHandler[] = [
    {
        id: 'ref',
        validate: (schema, value, params, state) => {
            if (!schema.has('$ref')) return
            // naive and simple validation for basic $ref support
            const refSchema = state.resource?.findRef(schema.get('$ref'))
            if (refSchema) {
                state.validate(refSchema.value(), value, params, state)
            }
        },
    },
    {
        id: 'type',
        // `type` validator
        validate: (schema, value, params, state) => {
            const type = schema.get('type')
            if (!type) return

            if (typeof value === 'undefined' && type && params.instanceLocation.length === 0) {
                state.output.addError({
                    error: ERROR_WRONG_TYPE,
                    context: {
                        actual: 'undefined',
                    },
                })
                return
            }

            if (typeof type !== 'undefined' && !validateTypes(value, type)) {
                state.output.addError({
                    error: ERROR_WRONG_TYPE,
                    context: {
                        actual: getValueType(value),
                    },
                })
            }
        },
    },
    {
        // `not` validator
        validate: (schema, value, params, state) => {
            if (!schema.has('not')) return
            const not = schema.get('not')
            // supporting `not` for any validations
            // https://json-schema.org/understanding-json-schema/reference/combining.html#not
            const tmpNot = state.validate(not, value, params, {root: state.root})
            if (tmpNot.valid) {
                state.output.addError({
                    error: 'not-is-valid',
                    // errors: tmpNot.errors || [],
                })
            }
        },
    },
    {
        types: ['string'],
        validate: (schema, value, _params, state) => {
            if (!schema.has('pattern')) return
            if (!validatePattern(value, schema.get('pattern'))) {
                state.output.addError({
                    error: ERROR_PATTERN,
                    context: {
                        pattern: schema.get('pattern'),
                        patternError: schema.get('patternError'),
                    },
                })
            }
        },
    },
    {
        validate: (schema, value, _params, state) => {
            if (!schema.has('const')) return
            if (!validateConst(schema.get('const'), value)) {
                state.output.addError({error: ERROR_CONST_MISMATCH, context: {const: schema.get('const')}})
            }
        },
    },
    {
        validate: (schema, value, _params, state) => {
            if (!schema.has('enum')) return
            if (!validateEnum(schema.get('enum'), value)) {
                state.output.addError({error: ERROR_ENUM_MISMATCH, context: {enum: schema.get('enum')}})
            }
        },
    },
    {
        types: ['number'],
        validate: (schema, value, _params, state) => {
            if (!schema.has('multipleOf')) return
            if (!validateMultipleOf(schema.get('multipleOf'), value)) {
                state.output.addError({error: ERROR_MULTIPLE_OF, context: {multipleOf: schema.get('multipleOf')}})
            }
        },
    },
    {
        types: ['string'],
        validate: (schema, value, _params, state) => {
            if (
                !['minLength', 'maxLength']
                    .some(keyword => schema.has(keyword))
            ) return
            validateMinMaxString(schema, value, state.output)
        },
    },
    {
        types: ['number'],
        validate: (schema, value, _params, state) => {
            if (
                !['minimum', 'exclusiveMinimum', 'maximum', 'exclusiveMaximum']
                    .some(keyword => schema.has(keyword))
            ) return
            validateMinMaxNumber(schema, value, state.output)
        },
    },
    {
        types: ['array'],
        validate: (schema, value, _params, state) => {
            if (
                !['minItems', 'maxItems']
                    .some(keyword => schema.has(keyword))
            ) return
            validateMinMaxArray(schema, value, state.output)
        },
    },
    {
        types: ['object'],
        validate: (schema, value, _params, state) => {
            if (
                !['minProperties', 'maxProperties']
                    .some(keyword => schema.has(keyword))
            ) return
            validateMinMaxObject(schema, value, state.output)
        },
    },
    {
        types: ['array'],
        validate: (schema, value, params, state) => {
            if (
                !['contains', 'minContains', 'maxContains']
                    .some(keyword => schema.has(keyword))
            ) return
            validateContains(schema, value, params, state)
        },
    },
    {
        id: 'required',
        // `required` validator - modern
        // todo: this is breaking the per-field validation used before,
        //       thus required-error won't reach the actual field
        types: ['object'],
        validate: (schema, value, _params, state) => {
            const requiredList = schema?.get('required') as List<string> | undefined
            if (!requiredList || !value) return
            // todo: the new validator only checks existence, not the "HTML-like required" like before
            if (Map.isMap(value) || Record.isRecord(value)) {
                requiredList.forEach(requiredKey => {
                    if (!value.has(requiredKey)) {
                        state.output.addError(ERROR_NOT_SET)
                    }
                })
            } else if (typeof value === 'object' && !Array.isArray(value)) {
                requiredList.forEach(requiredKey => {
                    if (!Object.hasOwnProperty.call(value, requiredKey)) {
                        state.output.addError(ERROR_NOT_SET)
                    }
                })
            }
        },
    },
    arrayValidator,
    objectValidator,
    oneOfValidator,
    {
        id: 'format:email',
        // `format: "email"` validator
        types: ['string' as const],
        validate: (schema, value, _params, state) => {
            if (schema.get('format') !== 'email') return
            if (!validateEmail(value)) {
                state.output.addError(ERROR_EMAIL_INVALID)
            }
        },
    },
]

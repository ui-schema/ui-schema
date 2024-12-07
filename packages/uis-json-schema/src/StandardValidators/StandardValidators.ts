import { toPointer } from '@ui-schema/json-pointer'
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
import { ValidatorOutput } from '@ui-schema/system/ValidatorOutput'
import { List, Map, Record } from 'immutable'

export const standardValidators: ValidatorHandler[] = [
    {
        id: 'ref',
        validate: (schema, value, params, state) => {
            if (!schema.has('$ref')) return
            // naive and simple validation for basic $ref support
            const refSchema = state.resource?.findRef(schema.get('$ref'))
            if (refSchema) {
                state.validate(
                    refSchema.value(),
                    value,
                    {
                        ...params,
                        keywordLocation: [...params.keywordLocation, '$ref'],
                    },
                    state,
                )
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
                    keywordLocation: toPointer([...params.keywordLocation, 'type']),
                    instanceLocation: toPointer(params.instanceLocation),
                    context: {
                        actual: 'undefined',
                    },
                })
                return
            }

            if (typeof type !== 'undefined' && !validateTypes(value, type)) {
                state.output.addError({
                    error: ERROR_WRONG_TYPE,
                    keywordLocation: toPointer([...params.keywordLocation, 'type']),
                    instanceLocation: toPointer(params.instanceLocation),
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
            const tmpNot = state.validate(
                not,
                value,
                {
                    ...params,
                    keywordLocation: [...params.keywordLocation, 'not'],
                },
                {root: state.root, resource: state.resource},
            )
            if (tmpNot.valid) {
                state.output.addError({
                    error: 'not-is-valid',
                    keywordLocation: toPointer([...params.keywordLocation, 'not']),
                    instanceLocation: toPointer(params.instanceLocation),
                    // errors: tmpNot.errors || [],
                })
            }
        },
    },
    {
        types: ['string'],
        validate: (schema, value, params, state) => {
            if (!schema.has('pattern')) return
            if (!validatePattern(value, schema.get('pattern'))) {
                state.output.addError({
                    error: ERROR_PATTERN,
                    keywordLocation: toPointer([...params.keywordLocation, 'pattern']),
                    instanceLocation: toPointer(params.instanceLocation),
                    context: {
                        pattern: schema.get('pattern'),
                        patternError: schema.get('patternError'),
                    },
                })
            }
        },
    },
    {
        validate: (schema, value, params, state) => {
            if (!schema.has('const')) return
            if (!validateConst(schema.get('const'), value)) {
                state.output.addError({
                    error: ERROR_CONST_MISMATCH,
                    keywordLocation: toPointer([...params.keywordLocation, 'const']),
                    instanceLocation: toPointer(params.instanceLocation),
                    context: {const: schema.get('const')},
                })
            }
        },
    },
    {
        validate: (schema, value, params, state) => {
            if (!schema.has('enum')) return
            if (!validateEnum(schema.get('enum'), value)) {
                state.output.addError({
                    error: ERROR_ENUM_MISMATCH,
                    keywordLocation: toPointer([...params.keywordLocation, 'enum']),
                    instanceLocation: toPointer(params.instanceLocation),
                    context: {enum: schema.get('enum')},
                })
            }
        },
    },
    {
        types: ['number'],
        validate: (schema, value, params, state) => {
            if (!schema.has('multipleOf')) return
            if (!validateMultipleOf(schema.get('multipleOf'), value)) {
                state.output.addError({
                    error: ERROR_MULTIPLE_OF,
                    keywordLocation: toPointer([...params.keywordLocation, 'multipleOf']),
                    instanceLocation: toPointer(params.instanceLocation),
                    context: {multipleOf: schema.get('multipleOf')},
                })
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
        validate: (schema, value, params, state) => {
            const requiredList = schema?.get('required') as List<string> | undefined
            if (!requiredList || !value) return
            // todo: the new validator only checks existence, not the "HTML-like required" like before
            if (Map.isMap(value) || Record.isRecord(value)) {
                requiredList.forEach(requiredKey => {
                    if (!value.has(requiredKey)) {
                        state.output.addError({
                            error: ERROR_NOT_SET,
                            keywordLocation: toPointer([...params.keywordLocation, 'required']),
                            instanceLocation: toPointer(params.instanceLocation),
                        })
                    }
                })
            } else if (typeof value === 'object' && !Array.isArray(value)) {
                requiredList.forEach(requiredKey => {
                    if (!Object.hasOwnProperty.call(value, requiredKey)) {
                        state.output.addError({
                            error: ERROR_NOT_SET,
                            keywordLocation: toPointer([...params.keywordLocation, 'required']),
                            instanceLocation: toPointer(params.instanceLocation),
                        })
                    }
                })
            }
        },
    },
    arrayValidator,
    objectValidator,
    // {
    //     id: 'unevaluatedProperties',
    //     types: ['object' as const],
    //     validate: (schema, value, _params, state) => {
    //         if (schema.get('unevaluatedProperties') === false) {
    //             // this validator must run after all others, including composition/conditionals
    //             // maybe allow a validator to attach itself to "on branch/layer done"?
    //         }
    //     },
    // },
    {
        id: 'format:email',
        // `format: "email"` validator
        types: ['string' as const],
        validate: (schema, value, params, state) => {
            if (schema.get('format') !== 'email') return
            if (!validateEmail(value)) {
                state.output.addError({
                    error: ERROR_EMAIL_INVALID,
                    keywordLocation: toPointer([...params.keywordLocation, 'format']),
                    instanceLocation: toPointer(params.instanceLocation),
                })
            }
        },
    },
    {
        id: 'if',
        validate: (schema, value, params, state) => {
            const keyIf = schema.get('if')
            if (!keyIf) return undefined
            const keyThen = schema.get('then')
            const keyElse = schema.get('else')

            const tmpIf = state.validate(
                keyIf,
                value,
                {
                    ...params,
                    keywordLocation: [...params.keywordLocation, 'if'],
                    instanceLocation: [],// reset to empty instanceLocation, to force strict undefined checks against `type`
                    instanceKey: undefined,
                    recursive: true,
                },
                {root: state.root, resource: state.resource},
            )
            if (tmpIf.valid) {
                if (keyThen) {
                    state.validate(
                        keyThen,
                        value,
                        {
                            ...params,
                            keywordLocation: [...params.keywordLocation, 'then'],
                        },
                        state,
                    )
                    return {
                        applied: [keyThen],
                    }
                }
            } else {
                if (keyElse) {
                    state.validate(
                        keyElse,
                        value,
                        {
                            ...params,
                            keywordLocation: [...params.keywordLocation, 'else'],
                        },
                        state,
                    )
                    return {
                        applied: [keyElse],
                    }
                }
            }
        },
    },
    oneOfValidator,
    {
        id: 'allOf',
        validate: (schema, value, params, state) => {
            const schemas = schema.get('allOf')
            if (!schemas) return undefined
            if (List.isList(schemas)) {
                // todo: note for finding applied schemas, while others (if/anyOf/oneOf) only need to return it's valid and applied schema,
                //       the `allOf` needs to tell all schemas as "applied", which will be different than what needs to be in the evaluated context
                for (const schema of schemas) {
                    const result = state.validate(
                        schema,
                        value,
                        {
                            ...params,
                            keywordLocation: [...params.keywordLocation, 'allOf'],
                        },
                        {root: state.root, resource: state.resource},
                    )
                    if (!result.valid) {
                        result.errors.forEach(err => state.output.addError(err))
                    }
                }
            }
            return {
                applied: schemas,
            }
        },
    },
    {
        id: 'anyOf',
        validate: (schema, value, params, state) => {
            const schemas = schema.get('anyOf')
            if (!schemas) return undefined
            let errorCount = 0
            let appliedSchema: any = undefined
            const output = new ValidatorOutput()
            if (List.isList(schemas)) {
                for (const schema of schemas) {
                    const result = state.validate(
                        schema,
                        value,
                        {
                            ...params,
                            keywordLocation: [...params.keywordLocation, 'anyOf'],
                            // todo: this only works for recursive, yet will mess up errors without being able to access them from children
                            recursive: true,
                        },
                        {root: state.root, resource: state.resource},
                    )
                    if (result.valid) {
                        errorCount = 0
                        appliedSchema = schema
                        break
                    } else {
                        errorCount++
                        result.errors.forEach(err => output.addError(err))
                    }
                }
            }

            if (errorCount) {
                output.errors.forEach(err => state.output.addError(err))
            }

            return {
                applied: [appliedSchema],
            }
        },
    },
    {
        id: 'dependent',
        validate: (schema, value, params, state) => {
            // `dependencies` is pre-2019-09, if the replacements`dependentSchemas`/`dependentRequired` are set they are preferred
            const dependencies = schema.get('dependencies')
            const dependentSchemas = schema.get('dependentSchemas')
            const dependentRequired = schema.get('dependentRequired')
            if (!Map.isMap(value)) return
            if (!dependencies && !dependentSchemas && !dependentRequired) return
            const applied: any[] = []
            value.keySeq().forEach(key => {
                const key_dependencies = dependencies ? dependencies.get(key) : undefined
                const key_dependentSchemas = dependentSchemas ? dependentSchemas.get(key) : Map.isMap(key_dependencies) ? key_dependencies : undefined
                const key_dependentRequired = dependentRequired ? dependentRequired.get(key) : List.isList(key_dependencies) ? key_dependencies : undefined

                // todo: what if the `key`'s own schema should be dynamically changed?
                //   what to remove?
                //   what to keep? when keeping e.g. `const` it could destroy `enum`s

                // "if property is present", must not use "if correct type"
                if (typeof value.get(key) !== 'undefined') {
                    if (key_dependentSchemas) {
                        // todo: as soon as a key exist, return that schema "all-applied"
                        //       or only what `validate` returns as "applied"?!
                        applied.push(key_dependentSchemas)
                        state.validate(
                            key_dependentSchemas,
                            value,
                            {
                                ...params,
                                keywordLocation: [...params.keywordLocation, 'dependentRequired'],
                                instanceLocation: [],// reset to empty instanceLocation, to force strict undefined checks against `type`
                                instanceKey: undefined,
                                // recursive: true,
                            },
                            state,
                            // {root: state.root, resource: state.resource},
                        )
                    }
                    if (key_dependentRequired) {
                        // todo: add all to "applied required"
                        applied.push(Map({required: key_dependentRequired}))
                        key_dependentRequired.forEach(req => {
                            if (typeof value.get(req) === 'undefined') {
                                state.output.addError({
                                    error: ERROR_NOT_SET,
                                    keywordLocation: toPointer([...params.keywordLocation, 'dependentRequired', key as string]),
                                    instanceLocation: toPointer(params.instanceLocation),
                                })
                            }
                        })
                    }
                }
            })

            return {
                applied: applied,
            }
        },
    },
]

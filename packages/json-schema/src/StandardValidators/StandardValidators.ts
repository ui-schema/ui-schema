import { toPointer } from '@ui-schema/json-pointer/toPointer'
import { ValidatorHandler, getValueType } from '@ui-schema/json-schema/Validator'
import {
    ERROR_CONST_MISMATCH,
    ERROR_ENUM_MISMATCH,
    ERROR_MULTIPLE_OF,
    ERROR_PATTERN,
    ERROR_WRONG_TYPE,
    validateConst,
    validateEnum,
    validateMultipleOf,
    validatePattern,
    objectValidator,
    oneOfValidator,
    validateTypes,
    ERROR_NOT_SET,
    validateMinMaxString, validateMinMaxNumber, validateMinMaxArray, validateMinMaxObject,
    arrayItemsValidator, arrayContainsValidator, arrayUniqueValidator,
} from '@ui-schema/json-schema/Validators'
import { ValidatorOutput } from '@ui-schema/ui-schema/ValidatorOutput'
import { List, Map, Record } from 'immutable'

export const standardValidators: ValidatorHandler[] = [
    {
        id: 'ref',
        validate: (schema, value, params) => {
            if (!schema.has('$ref')) return
            const refSchema = params.resource?.findRef(schema.get('$ref'))
            const applied: any[] = []
            if (refSchema) {
                const result = params.validate(
                    refSchema.value(),
                    value,
                    {
                        ...params,
                        keywordLocation: [...params.keywordLocation, '$ref'],
                        parentSchema: undefined,
                    },
                )
                applied.push(refSchema.value())
                applied.push(...result.applied || [])
            }
            return {
                applied: applied,
            }
        },
    },
    {
        id: 'type',
        // `type` validator
        validate: (schema, value, params) => {
            const type = schema.get('type')
            if (!type) return

            if (typeof value === 'undefined' && type && params.instanceLocation.length === 0) {
                params.output.addError({
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
                params.output.addError({
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
        validate: (schema, value, params) => {
            const not = schema.get('not')
            if (
                !not ||
                // never resolving conditionals if the value is undefined
                typeof value === 'undefined'
            ) return
            // supporting `not` for any validations
            // https://json-schema.org/understanding-json-schema/reference/combining.html#not
            const tmpNot = params.validate(
                not,
                value,
                {
                    ...params,
                    keywordLocation: [...params.keywordLocation, 'not'],
                    parentSchema: undefined,
                    output: new ValidatorOutput(),
                    context: {},
                },
            )
            if (tmpNot.valid) {
                params.output.addError({
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
        validate: (schema, value, params) => {
            if (!schema.has('pattern')) return
            if (!validatePattern(value, schema.get('pattern'))) {
                params.output.addError({
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
        validate: (schema, value, params) => {
            if (!schema.has('const')) return
            if (!validateConst(schema.get('const'), value)) {
                params.output.addError({
                    error: ERROR_CONST_MISMATCH,
                    keywordLocation: toPointer([...params.keywordLocation, 'const']),
                    instanceLocation: toPointer(params.instanceLocation),
                    context: {const: schema.get('const')},
                })
            }
        },
    },
    {
        validate: (schema, value, params) => {
            if (!schema.has('enum')) return
            if (!validateEnum(schema.get('enum'), value)) {
                params.output.addError({
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
        validate: (schema, value, params) => {
            if (!schema.has('multipleOf')) return
            if (!validateMultipleOf(schema.get('multipleOf'), value)) {
                params.output.addError({
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
        validate: (schema, value, params) => {
            if (
                !['minLength', 'maxLength']
                    .some(keyword => schema.has(keyword))
            ) return
            validateMinMaxString(schema, value, params.output)
        },
    },
    {
        types: ['number'],
        validate: (schema, value, params) => {
            if (
                !['minimum', 'exclusiveMinimum', 'maximum', 'exclusiveMaximum']
                    .some(keyword => schema.has(keyword))
            ) return
            validateMinMaxNumber(schema, value, params.output)
        },
    },
    {
        types: ['array'],
        validate: (schema, value, params) => {
            if (
                !['minItems', 'maxItems']
                    .some(keyword => schema.has(keyword))
            ) return
            validateMinMaxArray(schema, value, params.output)
        },
    },
    {
        types: ['object'],
        validate: (schema, value, params) => {
            if (
                !['minProperties', 'maxProperties']
                    .some(keyword => schema.has(keyword))
            ) return
            validateMinMaxObject(schema, value, params.output)
        },
    },
    {
        id: 'required',
        // `required` validator - modern
        // todo: this is breaking the per-field validation used before,
        //       thus required-error won't reach the actual field
        // todo: provide a way to configure undefined/null behaviour, which is not JSON Schema spec. compliant, but allows `required` validation in lookahead rendering
        //       - must only done for rendered-validation, where the field should be rendered, not for `if`, to stay JSON Schema compliant in most cases
        //         and only add the error for objects whose fields should be rendered and thus their required fields should be invalid
        //       - as rendering for objects occurs, even if the object doe not exist,
        //       - as storeUpdater auto-init nested structured, basically any "rendered object" should be considered "existing"
        //       - an alternative approach would be `init` button to create object, but then also `delete` buttons would be needed
        //         - which goes against form UX for endusers, as needs more complex knowledge how data editors work
        //         - so even if possible, not in scope of included design-system widget strategies
        //       - due to `valueLocation` being the object, the error can't be resolved via standards on the property itself;
        //         "not via standards" means it would need some error construct which is non-compliant to json-schema.

        // types: ['object'], // disabled type filter, to be able to validate null/undefined

        validate: (schema, value, params) => {
            const requiredList = schema?.get('required') as List<string> | undefined
            if (
                !requiredList ||
                // when recursive (spec-compliant/non-incremental) then don't validate non-existing objects
                (params.recursive && !value)
            ) return
            // todo: the new validator only checks existence, not the "HTML-like required" like before
            if (Map.isMap(value) || Record.isRecord(value)) {
                requiredList.forEach(requiredKey => {
                    if (!value.has(requiredKey)) {
                        params.output.addError({
                            error: ERROR_NOT_SET,
                            keywordLocation: toPointer([...params.keywordLocation, 'required']),
                            instanceLocation: toPointer(params.instanceLocation),
                            context: {requiredKey: requiredKey},
                        })
                    }
                })
            } else if (typeof value === 'object' && !Array.isArray(value)) {
                requiredList.forEach(requiredKey => {
                    if (!Object.hasOwnProperty.call(value, requiredKey)) {
                        params.output.addError({
                            error: ERROR_NOT_SET,
                            keywordLocation: toPointer([...params.keywordLocation, 'required']),
                            instanceLocation: toPointer(params.instanceLocation),
                            context: {requiredKey: requiredKey},
                        })
                    }
                })
            } else if (typeof value === 'undefined' || value === null) {
                requiredList.forEach(requiredKey => {
                    params.output.addError({
                        error: ERROR_NOT_SET,
                        keywordLocation: toPointer([...params.keywordLocation, 'required']),
                        instanceLocation: toPointer(params.instanceLocation),
                        context: {requiredKey: requiredKey},
                    })
                })
            }
        },
    },
    objectValidator,
    {
        id: 'unevaluatedProperties',
        types: ['object' as const],
        validate: (schema, value, params) => {
            if (schema.get('unevaluatedProperties') === false && Map.isMap(value) && value.size) {
                // this validator must run after all others, including composition/conditionals
                return {
                    afterAll: (result) => {
                        const keys = value.keys()
                        const evaluatedProperties = result.context?.evaluatedProperties
                        if (!evaluatedProperties) {
                            params.output.addError({
                                error: 'unevaluated-property',
                                context: {keys: Array.from(keys)},
                            })
                            return
                        }
                        for (const key of keys) {
                            if (!evaluatedProperties.has(key as string)) {
                                // todo: should this use the main `output` or some of the afterAll stage?
                                params.output.addError({
                                    error: 'unevaluated-property',
                                    context: {key: key},
                                })
                                break
                            }
                        }
                    },
                }
            }
        },
    },
    arrayItemsValidator,
    arrayContainsValidator,
    arrayUniqueValidator,
    {
        id: 'if',
        validate: (schema, value, params) => {
            const keyIf = schema.get('if')
            if (
                !keyIf ||
                // never resolving conditionals if the value is undefined,
                // json-schema standard doesn't traverse branches not needed to be evaluated,
                // while ui-schema needs to reduce all possible reachable branches directly,
                // leading to the case where ui-schema encounters conditionals which normally won't have any effect
                // todo: improve behaviour with explicitly tracking existence and how to traverse deeper,
                //       - validation doesn't need to go in level where no value exists
                //       - ui-generation needs to look a head for reducing branches to a happy path and finding what could be possible to exist
                typeof value === 'undefined'
            ) return undefined
            const keyThen = schema.get('then')
            const keyElse = schema.get('else')

            const tmpIf = params.validate(
                keyIf,
                value,
                {
                    ...params,
                    keywordLocation: [...params.keywordLocation, 'if'],
                    // todo: this comment and behaviour is outdated
                    instanceLocation: [],// reset to empty instanceLocation, to force strict undefined checks against `type`
                    instanceKey: undefined,
                    parentSchema: undefined,
                    recursive: true,
                    output: new ValidatorOutput(),
                    context: {},
                },
            )
            if (tmpIf.valid) {
                if (keyThen) {
                    const result = params.validate(
                        keyThen,
                        value,
                        {
                            ...params,
                            keywordLocation: [...params.keywordLocation, 'then'],
                            parentSchema: undefined,
                        },
                    )
                    return {
                        applied: [keyThen, ...result.applied || []],
                    }
                }
            } else {
                if (keyElse) {
                    const result = params.validate(
                        keyElse,
                        value,
                        {
                            ...params,
                            keywordLocation: [...params.keywordLocation, 'else'],
                            parentSchema: undefined,
                        },
                    )
                    return {
                        applied: [keyElse, ...result.applied || []],
                    }
                }
            }
        },
    },
    oneOfValidator,
    {
        id: 'allOf',
        validate: (schema, value, params) => {
            const schemas = schema.get('allOf')
            if (!schemas) return undefined
            const applied = [...schemas.toArray()]
            if (List.isList(schemas)) {
                // todo: note for finding applied schemas, while others (if/anyOf/oneOf) only need to return it's valid and applied schema,
                //       the `allOf` needs to tell all schemas as "applied", which will be different than what needs to be in the evaluated context
                for (const schema of schemas) {
                    const result = params.validate(
                        schema,
                        value,
                        {
                            ...params,
                            keywordLocation: [...params.keywordLocation, 'allOf'],
                            parentSchema: undefined,
                        },
                    )
                    // todo: validate applied behaviour
                    applied.push(...result.applied || [])
                }
            }
            return {
                applied: applied,
            }
        },
    },
    {
        id: 'anyOf',
        validate: (schema, value, params) => {
            const schemas = schema.get('anyOf')
            if (!schemas) return undefined
            let errorCount = 0
            let appliedSchema: any = undefined
            const output = new ValidatorOutput()
            if (List.isList(schemas)) {
                for (const schema of schemas) {
                    const context = {}
                    const result = params.validate(
                        schema,
                        value,
                        {
                            ...params,
                            keywordLocation: [...params.keywordLocation, 'anyOf'],
                            parentSchema: undefined,
                            // todo: this only works for recursive, yet will mess up errors without being able to access them from children
                            recursive: true,
                            output: new ValidatorOutput(),
                            context: context,
                        },
                    )
                    if (result.valid) {
                        errorCount = 0
                        // todo: use `result.applied`
                        appliedSchema = schema
                        // todo: merge context
                        // params.context ||= context
                        break
                    } else {
                        errorCount++
                        result.errors.forEach(err => output.addError(err))
                    }
                }
            }

            if (errorCount) {
                output.errors.forEach(err => params.output.addError(err))
            }

            return {
                applied: [appliedSchema],
            }
        },
    },
    {
        id: 'dependent',
        validate: (schema, value, params) => {
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
                        //       the current strategy is "applied are merged into the base schema",
                        //       thus the `key_dependentSchemas` and `result.applied` are both needed,
                        //       where mergeSchemas in the end can ignore all composition and condition keyword
                        applied.push(key_dependentSchemas)
                        const result = params.validate(
                            key_dependentSchemas,
                            value,
                            {
                                ...params,
                                keywordLocation: [...params.keywordLocation, 'dependentRequired'],
                                instanceLocation: [],// reset to empty instanceLocation, to force strict undefined checks against `type`
                                instanceKey: undefined,
                                parentSchema: undefined,
                                // recursive: true,
                            },
                        )
                        applied.push(...result.applied || [])
                    }
                    if (key_dependentRequired) {
                        // todo: add all to "applied required"
                        applied.push(Map({required: key_dependentRequired}))
                        key_dependentRequired.forEach(req => {
                            if (typeof value.get(req) === 'undefined') {
                                params.output.addError({
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

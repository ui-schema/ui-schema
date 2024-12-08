import { toPointer } from '@ui-schema/json-pointer'
import { ValidatorParams, ValidatorState, ValidatorStateNested, ValidatorHandler, getValueType } from '@ui-schema/json-schema/Validator'
import { ValidatorOutput } from '@ui-schema/system/ValidatorOutput'
import { List } from 'immutable'
import { ERROR_WRONG_TYPE } from '@ui-schema/json-schema/Validators/TypeValidator'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export const ERROR_DUPLICATE_ITEMS = 'duplicate-items'
export const ERROR_NOT_FOUND_CONTAINS = 'not-found-contains'
export const ERROR_MIN_CONTAINS = 'min-contains'
export const ERROR_MAX_CONTAINS = 'max-contains'
export const ERROR_ADDITIONAL_ITEMS = 'additional-items'

const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)

export const validateArrayContent = (
    itemsSchema: UISchemaMap | List<UISchemaMap>,
    value: unknown,
    additionalItems: boolean = true,
    // if `output` is in `params`, the output is added directly to it.
    // with this the calling function can control if adding errors to global or using the result.
    params: ValidatorParams & (ValidatorStateNested | ValidatorState),
): {
    output: ValidatorOutput
    found: number
} => {
    const output = 'output' in params && params.output ? params.output : new ValidatorOutput()
    let found = 0
    if (
        (List.isList(itemsSchema)/* || Array.isArray(itemsSchema)*/)
    ) {
        // tuple validation
        if (List.isList(value) || Array.isArray(value)) {
            // for tuples, the actual item must be an array/list also
            // todo: add values as array support
            // todo: implement tuple validation
            //   actually, only `additionalItems` should be needed to be validated here, the other values should be validated when the input for them is rendered
            //   as "only what is mounted can be entered and validated"
            //   but they must be usable for within conditional schemas
            if (!validateAdditionalItems(additionalItems, value, itemsSchema)) {
                // todo: add index of erroneous item; or at all as one context list, only one error instead of multiple?
                output.addError({
                    error: ERROR_ADDITIONAL_ITEMS,
                    keywordLocation: toPointer([...params.keywordLocation, 'additionalItems']),
                    instanceLocation: toPointer(params.instanceLocation),
                })
                found++
            }

            if (params.recursive) {
                const listSize = itemsSchema.size || 0
                let i = 0
                for (const val of value) {
                    if (i >= listSize) break
                    const result = params.validate(
                        itemsSchema.get(i),
                        val,
                        {
                            ...params,
                            // todo: this won't always be `items`!
                            keywordLocation: [...params.keywordLocation, 'items'],
                            instanceLocation: [...params.instanceLocation, i],
                            instanceKey: i,
                            output: 'output' in params && params.output ? params.output : new ValidatorOutput(),
                            context: {},
                        },
                    )
                    if (result.valid) {
                        found++
                    } else if (!('output' in params && params.output)) {
                        result.errors.forEach(err2 => output.addError(err2))
                    }
                    i++
                }
            }
        } else {
            //console.log('val?.toJS()', /*val,*/ schema?.toJS(), value?.toJS())
            // when tuple schema but no-tuple value
            output.addError({
                error: ERROR_WRONG_TYPE,
                context: {actual: getValueType(value), arrayTupleValidation: true},
            })
            found++
        }
    }/* else if(
        itemsSchema.get('type') === 'array' &&
        (List.isList(nestedItemsSchema) || Array.isArray(nestedItemsSchema))
    ) {
        // nested tuple validation
        console.log('nested tuple validation', itemsSchema?.toJS())
    } else if(
        itemsSchema.get('type') === 'array' &&
        (Map.isMap(nestedItemsSchema) || typeof nestedItemsSchema === 'object')
    ) {
        // a nested "one-schema-for-all" array, nested in the current array
        console.log('nested one-schema-for-all', itemsSchema?.toJS())
    }*/
    else if (Array.isArray(value) || List.isList(value)) {
        // }*/ else if(!schemaTypeIs(itemsSchema.get('type'), 'array')) {
        // no nested array, one-schema for all items
        // not validating array content of array here, must be validated with next schema level
        let i = 0
        for (const val of value) {
            // single-validation
            // Cite from json-schema.org: When items is a single schema, the additionalItems keyword is meaningless, and it should not be used.
            const result = params.validate(
                itemsSchema, val,
                {
                    ...params,
                    // todo: this won't always be `items`!
                    keywordLocation: [...params.keywordLocation, 'items'],
                    instanceLocation: [...params.instanceLocation, i],
                    instanceKey: i,
                    output: 'output' in params && params.output ? params.output : new ValidatorOutput(),
                    context: {},
                },
            )
            if (result.valid) {
                found++
            } else if (!('output' in params && params.output)) {
                result.errors.forEach(err2 => output.addError(err2))
            }
            i++
        }
    }

    return {
        output,
        found,
    }
}

export const validateAdditionalItems = (additionalItems: boolean, value: List<any> | any[], schema: List<UISchemaMap>): boolean => {
    return additionalItems || (!additionalItems && (
        (List.isList(value) && value.size <= schema.size) ||
        (Array.isArray(value) && value.length <= schema.size)
    ))
}

export const validateItems = (
    schema: UISchemaMap,
    value: any,
    params: ValidatorParams & ValidatorState,
) => {
    const items = schema.get('items')
    if (items && value) {
        validateArrayContent(items, value, schema.get('additionalItems'), {
            ...params,
            parentSchema: schema,
        })
    }
}

export const validateContains = (
    schema: UISchemaMap,
    value: List<any> | any[] | any,
    params: ValidatorParams & ValidatorState,
) => {
    if (!(Array.isArray(value) || List.isList(value))) return

    const contains = schema.get('contains')
    if (!contains) return
    const contains_type = contains.get('type')
    if (!contains_type) return

    const minContains = schema.get('minContains')
    const maxContains = schema.get('maxContains')

    const item_err = validateArrayContent(
        contains,
        value,
        undefined,
        {
            ...params,
            parentSchema: schema,
            keywordLocation: [...params.keywordLocation, 'contains'],
            recursive: true,
            output: undefined,
            context: {},
        },
    )

    if (
        (item_err.found < 1 && typeof minContains === 'undefined' && typeof maxContains === 'undefined') ||
        (typeof minContains === 'number' && minContains > item_err.found) ||
        (typeof maxContains === 'number' && maxContains < item_err.found)
    ) {
        if (item_err.output.errCount !== 0) {
            item_err.output.errors.forEach(err => params.output.addError(err))
        }
    }

    if (typeof minContains === 'number' && minContains > item_err.found) {
        params.output.addError({
            error: ERROR_MIN_CONTAINS,
            keywordLocation: toPointer([...params.keywordLocation, 'minContains']),
            instanceLocation: toPointer(params.instanceLocation),
            context: {minContains},
        })
    }
    if (typeof maxContains === 'number' && maxContains < item_err.found) {
        params.output.addError({
            error: ERROR_MAX_CONTAINS,
            keywordLocation: toPointer([...params.keywordLocation, 'maxContains']),
            instanceLocation: toPointer(params.instanceLocation),
            context: {maxContains},
        })
    }

    if (
        minContains !== 0 &&
        ((Array.isArray(value) && value.length === 0) || (List.isList(value) && value.size === 0))
    ) {
        params.output.addError({
            error: ERROR_NOT_FOUND_CONTAINS,
            keywordLocation: toPointer([...params.keywordLocation, 'contains']),
            instanceLocation: toPointer(params.instanceLocation),
        })
    }
}

export const validateUniqueItems = (schema: UISchemaMap, value: List<any> | any[] | unknown): boolean => {
    const uniqueItems = schema.get('uniqueItems')
    if (uniqueItems && (List.isList(value) || Array.isArray(value))) {
        const duplicates = findDuplicates(value)
        if (Array.isArray(duplicates)) {
            return duplicates.length === 0
        } else if (List.isList(duplicates)) {
            return duplicates.size === 0
        }
    }
    return true
}

export const arrayValidator: ValidatorHandler = {
    types: ['array'],
    validate: (schema, value, params) => {
        if (!schema || !value) return
        // unique-items sub-schema is intended for dynamics and for statics, e.g. Selects could have duplicates but also a SimpleList of strings
        const uniqueItems = schema?.get('uniqueItems')
        if (uniqueItems) {
            if (!validateUniqueItems(schema, value)) {
                params.output.addError({
                    error: ERROR_DUPLICATE_ITEMS,
                    keywordLocation: toPointer([...params.keywordLocation, 'uniqueItems']),
                    instanceLocation: toPointer(params.instanceLocation),
                })
            }
        }

        /*
         * `items` sub-schema validation is intended for dynamic-inputs like SimpleList or GenericList
         * - thus the validity must also be checked in the components rendering the sub-schema,
         * - when validation is done here, the parent receives the invalidations instead of the actual component that is invalid
         * - e.g. 2 out of 3 are invalid, only one error is visible on the parent-component
         * - but when the items are not valid, the parent should also know that something is invalid
         * - providing context `arrayItems = true` for errors makes it possible to distinct the errors in the parent-component
         * - full sub-schema validation is done (and possible) if the sub-schema is rendered through e.g. PluginStack isVirtual
         */
        const items = schema?.get('items')
        if (items && params.recursive) {
            validateItems(schema, value, params)
        }

        // `contains` sub-schema is intended for components which may be dynamic, but the error is intended to be shown on the root-component and not the sub-schema, as not clear which-sub-schema it is, "1 out of n sub-schemas must be valid" can not logically translated to "specific sub-schema X is invalid"
        // todo: the error displayed on the the array component may be confusing, it should be possible to distinct between "own-errors" and child-errors
        //    maybe adding a possibility to update the validity for sub-schemas from the parent-component?
        const contains = schema?.get('contains')
        if (contains) {
            validateContains(schema, value, params)
        }
    },
}

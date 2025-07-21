import { toPointer } from '@ui-schema/json-pointer/toPointer'
import { ValidatorParams, ValidatorState, ValidatorHandler } from '@ui-schema/json-schema/Validator'
import { ValidatorOutput } from '@ui-schema/ui-schema/ValidatorOutput'
import { List, is } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export const ERROR_DUPLICATE_ITEMS = 'duplicate-items'
export const ERROR_NOT_FOUND_CONTAINS = 'not-found-contains'
export const ERROR_MIN_CONTAINS = 'min-contains'
export const ERROR_MAX_CONTAINS = 'max-contains'
export const ERROR_ADDITIONAL_ITEMS = 'additional-items'

interface DuplicateEntry {
    value: unknown
    indexes: number[]
}

const findDuplicates = (
    arr: List<unknown> | unknown[],
    isEqual: (a: unknown, b: unknown) => boolean,
): DuplicateEntry[] => {
    const arrInterop =
        Array.isArray(arr)
            ? {
                size: arr.length,
                get: (i) => arr[i],
            }
            : arr

    const seen: {
        value: any
        indexes: number[]
    }[] = []

    for (let i = 0; i < arrInterop.size; i++) {
        const val = arrInterop.get(i)

        const existing = seen.find(entry => isEqual(entry.value, val))
        if (existing) {
            existing.indexes.push(i)
        } else {
            seen.push({value: val, indexes: [i]})
        }
    }

    return seen.filter(entry => entry.indexes.length > 1)
}

/**
 * Validates if all items in an array are unique.
 */
export const validateUniqueItems = (
    schema: UISchemaMap,
    value: List<any> | any[],
    params?: ValidatorParams & ValidatorState, // optional for pointer reporting
): boolean => {
    const uniqueItems = schema.get('uniqueItems')
    if (!uniqueItems) {
        return true
    }

    const duplicates = findDuplicates(value, is)

    if (duplicates.length > 0 && params) {
        params.output.addError({
            error: ERROR_DUPLICATE_ITEMS,
            keywordLocation: toPointer([...params.keywordLocation, 'uniqueItems']),
            instanceLocation: toPointer(params.instanceLocation),
            context: {
                duplicates: duplicates.map(d => ({
                    value: d.value,
                    indexes: d.indexes,
                })),
            },
        })
    }

    return duplicates.length === 0
}

/**
 * A helper to validate a list of items against a single schema.
 * Used for `contains` validation. It counts the number of valid items
 * without polluting the main output with errors from non-matching items.
 */
export const validateItemsAgainstSchema = (
    itemsToValidate: List<any> | any[],
    schemaToValidate: UISchemaMap,
    params: ValidatorParams & ValidatorState,
): { found: number } => {
    let found = 0
    let i = 0
    for (const val of itemsToValidate) {
        // Run a "silent" validation to check for a match.
        const result = params.validate(
            schemaToValidate,
            val,
            {
                ...params,
                instanceLocation: [...params.instanceLocation, i],
                instanceKey: i,
                output: new ValidatorOutput(), // Use a temporary output to check validity
                context: {}, // Isolate context
            },
        )
        if (result.valid) {
            found++
        }
        i++
    }
    return {found}
}

/**
 * Normalizes array validation keywords from different JSON Schema drafts.
 *
 * - Draft 2019-09+: `prefixItems` (tuple), `items` (additional)
 * - Draft-07 and below: `items` (tuple or single), `additionalItems` (additional)
 */
const normalizeArraySchema = (schema: UISchemaMap) => {
    const itemsTmp = schema.get('items')
    const prefixItemsTmp = schema.get('prefixItems')
    const additionalItemsTmp = schema.get('additionalItems')

    let prefixItems: List<any> | undefined = undefined
    let items: UISchemaMap | undefined = undefined
    let additionalItemsAllowed = true

    if (prefixItemsTmp !== undefined && List.isList(prefixItemsTmp)) {
        // Draft 2019-09+ style: `prefixItems` for tuple validation.
        prefixItems = prefixItemsTmp
        // @ts-ignore
        if (itemsTmp === false) {
            additionalItemsAllowed = false
        } else if (typeof itemsTmp === 'object' && itemsTmp !== null) {
            items = itemsTmp as UISchemaMap
        }
    } else if (List.isList(itemsTmp)) {
        // Draft-07 style: `items` as an array for tuple validation.
        prefixItems = itemsTmp
        if (additionalItemsTmp === false) {
            additionalItemsAllowed = false
        } else if (typeof additionalItemsTmp === 'object' && additionalItemsTmp !== null) {
            items = additionalItemsTmp as UISchemaMap
        }
    } else if (typeof itemsTmp === 'object' && itemsTmp !== null) {
        items = itemsTmp as UISchemaMap
    } else if (itemsTmp === false) {
        additionalItemsAllowed = false
    }

    return {prefixItems, items, additionalItemsAllowed}
}

/**
 * Validates array items against `items`, `prefixItems`, and `additionalItems` keywords.
 * It handles both tuple and list validation across different JSON Schema drafts.
 */
export const validateItems = (
    schema: UISchemaMap,
    value: List<any> | any[],
    params: ValidatorParams & ValidatorState,
): void => {
    const {
        prefixItems,
        items,
        additionalItemsAllowed,
    } = normalizeArraySchema(schema)

    const prefixItemsCount = prefixItems?.size || 0
    let i = 0
    for (const val of value) {
        let itemSchema: UISchemaMap | undefined = undefined
        let keyword = 'items'

        if (i < prefixItemsCount) {
            itemSchema = prefixItems!.get(i)
            keyword = schema.has('prefixItems') ? 'prefixItems' : 'items'
        } else {
            // current item is an "additional" item
            if (!additionalItemsAllowed) {
                params.output.addError({
                    error: ERROR_ADDITIONAL_ITEMS,
                    keywordLocation: toPointer([
                        ...params.keywordLocation,
                        // @ts-ignore
                        schema.get('items') === false ? 'items' : 'additionalItems',
                    ]),
                    instanceLocation: toPointer([...params.instanceLocation, i]),
                })
                i++
                continue
            }
            itemSchema = items
            keyword = 'items'
        }

        if (itemSchema) {
            params.validate(
                itemSchema,
                val,
                {
                    ...params,
                    keywordLocation:
                        prefixItems?.has(i)
                            ? [...params.keywordLocation, keyword, i]
                            : [...params.keywordLocation, keyword],
                    instanceLocation: [...params.instanceLocation, i],
                    instanceKey: i,
                },
            )
        }
        i++
    }
}

/**
 * Validates the array against `contains`, `minContains`, and `maxContains` keywords.
 */
export const validateContains = (
    schema: UISchemaMap,
    value: List<any> | any[],
    params: ValidatorParams & ValidatorState,
): void => {
    const containsSchema = schema.get('contains')
    if (typeof containsSchema !== 'object' || containsSchema === null) return

    const minContains = schema.get('minContains') as number | undefined ?? 1
    const maxContains = schema.get('maxContains') as number | undefined

    const {found} = validateItemsAgainstSchema(
        value,
        containsSchema as UISchemaMap,
        params,
    )

    if (found < minContains) {
        const isDefaultMinContains = minContains === 1 && !schema.has('minContains')
        params.output.addError({
            error: isDefaultMinContains ? ERROR_NOT_FOUND_CONTAINS : ERROR_MIN_CONTAINS,
            keywordLocation: toPointer([
                ...params.keywordLocation,
                isDefaultMinContains ? 'contains' : 'minContains',
            ]),
            instanceLocation: toPointer(params.instanceLocation),
            context: {minContains, found},
        })
    }

    if (typeof maxContains === 'number' && found > maxContains) {
        params.output.addError({
            error: ERROR_MAX_CONTAINS,
            keywordLocation: toPointer([...params.keywordLocation, 'maxContains']),
            instanceLocation: toPointer(params.instanceLocation),
            context: {maxContains, found},
        })
    }
}

/**
 * The main validator for the `array` type.
 * Handles `uniqueItems`, `contains`, and recursively validates `items`/`prefixItems`.
 */
export const arrayValidator: ValidatorHandler = {
    types: ['array'],
    validate: (schema, value, params) => {
        if (!(List.isList(value) || Array.isArray(value))) {
            return
        }

        if (schema.get('uniqueItems')) {
            validateUniqueItems(schema, value, params)
        }

        if (schema.has('contains')) {
            validateContains(schema, value, params)
        }

        /*
         * `items`/`prefixItems` validation is recursive and intended for dynamic-inputs like SimpleList or GenericList.
         * - The validity must also be checked in the components rendering the sub-schema.
         * - When validation is done here, the parent receives the invalidations instead of the actual component that is invalid.
         * - This is controlled by the `recursive` flag, which enables look-ahead optimistic schema reduction.
         */
        if (params.recursive) {
            validateItems(schema, value, params)
        }
    },
}

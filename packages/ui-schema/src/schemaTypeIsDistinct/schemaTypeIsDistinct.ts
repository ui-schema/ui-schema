import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { List } from 'immutable'

/**
 * Checks if a given schema type is distinct, meaning it is the only type present,
 * optionally ignoring certain types (like 'null').
 *
 * This function is useful for determining if a schema strictly represents a single type,
 * even if 'null' is also allowed alongside it.
 *
 * @param {SchemaTypesType} isType The schema type(s) to check. Can be a string or an array of strings.
 * @param {string} expectedType The type that is expected to be the distinct type.
 * @param {null | Set<string>} [ignoreTypes=new Set(['null'])] An optional Set of types to ignore when checking for distinctness.
 *                                                               If `expectedType` is in `ignoreTypes`, it is NOT ignored.
 * @returns {boolean} True if `expectedType` is the only type in `isType` (after ignoring `ignoreTypes`), false otherwise.
 */
export function schemaTypeIsDistinct(
    isType: SchemaTypesType,
    expectedType: string,
    ignoreTypes: null | Set<string> = ignoreTypesDefault,
): boolean {
    if (typeof isType === 'string') {
        return isType === expectedType
    }

    if (Array.isArray(isType) || List.isList(isType)) {
        let foundExpectedType = false

        for (const type of isType) {
            if (type === expectedType) {
                foundExpectedType = true
            } else if (!ignoreTypes?.has(type)) {
                return false
            }
        }

        return foundExpectedType
    }

    return false
}

const ignoreTypesDefault = new Set(['null'])

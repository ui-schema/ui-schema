import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { List } from 'immutable'

/**
 * Checks if a given schema type matches a single expected type.
 * This function is useful for determining if a schema explicitly defines a certain type,
 * whether it's a single string type or an array of types that includes the expected one.
 *
 * @param {SchemaTypesType} isType The schema type(s) to check. Can be a string or an array of strings.
 * @param {string} expectedType The type that is expected to be present.
 * @returns {boolean} True if `isType` is `expectedType` or if `isType` (when an array) includes `expectedType`, false otherwise.
 */
export const schemaTypeIs = (isType: SchemaTypesType, expectedType: string): boolean => {
    return Boolean(typeof isType !== 'undefined' && (typeof isType === 'string' ? isType === expectedType : isType.includes(expectedType)))
}

/**
 * Checks if a given schema type is a numeric type (either 'number' or 'integer').
 * This is a convenience function built on top of `schemaTypeIs` for common numeric checks.
 *
 * @param {SchemaTypesType} type The schema type(s) to check.
 * @returns {boolean} True if the type is 'number' or 'integer', false otherwise.
 */
export const schemaTypeIsNumeric = (type: SchemaTypesType): boolean => schemaTypeIs(type, 'number') || schemaTypeIs(type, 'integer')

/**
 * Checks if a given schema type matches any of the provided expected types.
 * This function is useful when a component or logic needs to apply to multiple
 * possible schema types, such as handling both 'string' and 'number' inputs.
 * It supports single type strings and arrays of types.
 *
 * @param {SchemaTypesType} isType The schema type(s) to check. Can be a string or an array of strings.
 * @param {string[]} expectedTypes An array of strings representing the types to check against.
 * @returns {boolean} True if `isType` matches any of the `expectedTypes`, false otherwise.
 */
export const schemaTypeIsAny = (isType: SchemaTypesType, expectedTypes: string[]): boolean => {
    if (typeof isType === 'undefined') return false
    if (typeof isType === 'string') {
        return expectedTypes.includes(isType)
    }
    if (Array.isArray(isType) || List.isList(isType)) {
        return expectedTypes.reduce((c, v) => c || (isType as any[]).includes(v), false)
    }
    return false
}

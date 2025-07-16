import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'

/**
 * Returns true if the `expectedType` is the only one existing in the `isType`.
 *
 * Distinct means, the expected type exists in isType, and it is the only one in there, while ignoring any `ignoreType` in `isType`,
 * but if the `expectedType` is in the `ignoreTypes`, it isn't ignored.
 */
export const schemaTypeIsDistinct = (
    isType: SchemaTypesType,
    expectedType: string,
    ignoreTypes: null | Set<string> = ignoreTypesDefault,
): boolean => {
    if (typeof isType === 'string') {
        return isType === expectedType
    }

    if (Array.isArray(isType)) {
        if (isType.length === 0) {
            return false
        }

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

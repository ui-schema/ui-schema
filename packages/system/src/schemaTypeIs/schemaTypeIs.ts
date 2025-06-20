import { SchemaTypesType } from '@ui-schema/system/CommonTypings'

export const schemaTypeIs = (isType: SchemaTypesType, expectedType: string): boolean => {
    return Boolean(typeof isType !== 'undefined' && (typeof isType === 'string' ? isType === expectedType : isType.includes(expectedType)))
}

export const schemaTypeIsNumeric = (type: SchemaTypesType): boolean => schemaTypeIs(type, 'number') || schemaTypeIs(type, 'integer')

export const schemaTypeIsAny = (isType: SchemaTypesType, expectedTypes: string[]): boolean => {
    return Boolean(typeof isType !== 'undefined' && (
        typeof isType === 'string' ? expectedTypes.includes(isType) :
            expectedTypes.reduce((c, v) => c || isType.includes(v), false)
    ))
}

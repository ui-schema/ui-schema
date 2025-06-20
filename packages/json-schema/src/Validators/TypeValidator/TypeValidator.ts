import { List, Map, Record } from 'immutable'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'

export const ERROR_WRONG_TYPE = 'wrong-type'

export const validateType = (
    value: unknown,
    type: SchemaTypesType,
): boolean => {
    if (typeof value === 'undefined' || typeof type === 'undefined') return true

    const isValidType = (value, type) => {
        return typeof value === type
    }

    if (type === 'string') {
        return isValidType(value, 'string')
    }
    if (type === 'number') {
        return isValidType(value, 'number')
    }
    if (type === 'integer') {
        return !isNaN(Number(value)) && Number.isInteger(value)
    }
    if (type === 'boolean') {
        return isValidType(value, 'boolean')
    }
    if (type === 'array') {
        return Array.isArray(value) || List.isList(value)
    }
    if (type === 'object') {
        return null !== value && (
            !(Array.isArray(value) || List.isList(value)) &&
            (typeof value === 'object' || Map.isMap(value) || Record.isRecord(value))
        )
    }

    if (type === 'null') {
        return null === value
    }

    return false
}

export const validateTypes = (
    value: unknown,
    type: string | string[] | List<string>,
): boolean => {
    if (typeof value === 'undefined') return true

    if (typeof type === 'string') {
        type = List([type])
    }
    return (type as List<string>)
        .reduce((c, t) => c || validateType(value, t), false)
}

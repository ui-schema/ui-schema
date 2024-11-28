import { JsonSchemaKeywordType } from '@ui-schema/json-schema/Definitions'
import { List, Map, Record } from 'immutable'

const jsonTypes = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
}

export function getValueType(value: unknown): JsonSchemaKeywordType | undefined {
    if (value === null) {
        return 'null'
    }
    if (List.isList(value)) {
        return 'array'
    }
    if (Map.isMap(value) || Record.isRecord(value)) {
        return 'object'
    }
    if (typeof value === 'object') {
        return Array.isArray(value) ? 'array' : 'object'
    }
    const type = typeof value
    if (type in jsonTypes) {
        return jsonTypes[type]
    }
    return undefined
}

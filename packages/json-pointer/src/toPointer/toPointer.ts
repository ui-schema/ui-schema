import { escapePointer } from '@ui-schema/json-pointer'
import { List } from 'immutable'

const transformKey = (key: string | number) => {
    return typeof key === 'string' ? escapePointer(key) : key
}

export const toPointer = (
    keys: (string | number)[] | List<string | number>,
) => {
    if (Array.isArray(keys)) {
        if (!keys.length) return ''
        return '/' + keys.map(transformKey).join('/')
    }
    if (!keys.size) return ''

    return '/' + keys.map(transformKey).join('/')
}

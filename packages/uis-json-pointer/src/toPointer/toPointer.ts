import { escapePointer } from '@ui-schema/json-pointer'
import { List } from 'immutable'

export const toPointer = (
    keys: (string | number)[] | List<string | number>,
) => {
    if (Array.isArray(keys)) {
        if (!keys.length) return ''
        return '/' + keys.map(key => {
            return typeof key === 'number' ? key : escapePointer(key)
        }).join('/')
    }
    if (!keys.size) return ''

    return '/' + keys.map(key => {
        return typeof key === 'number' ? key : escapePointer(key)
    }).join('/')
}

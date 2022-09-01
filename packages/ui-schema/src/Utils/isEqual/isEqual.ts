import { List, Map, Record } from 'immutable'

export const isEqual = (a: any, b: any): boolean => {
    if(List.isList(b) || Map.isMap(b) || Record.isRecord(b)) {
        return b.equals(a)
    } else if(Array.isArray(b)) {
        return a === b
    } else if(typeof b === 'object') {
        return Object.is(a, b)
    }

    // these should be any scalar values
    return a === b
}

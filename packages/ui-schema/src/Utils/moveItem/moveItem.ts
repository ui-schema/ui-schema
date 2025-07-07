import { List } from 'immutable'

/**
 * Map and List compatible 'switch place of item' function
 */
export const moveItem = (
    value: List<any>,
    oldI: number,
    newI: number,
): List<any> => {
    if (
        !value ||
        newI < 0 || value.size <= newI ||
        oldI < 0 || value.size <= oldI
    ) return value

    if (List.isList(value)) {
        const srcItem = value.get(oldI)
        return value.splice(oldI, 1).splice(newI, 0, srcItem)
    }

    return value
}

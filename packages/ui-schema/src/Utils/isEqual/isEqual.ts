import { isImmutable, Record } from 'immutable'

/**
 * Checks if two values are structurally equal, with special handling for Immutable.js collections.
 */
export const isEqual = (a: unknown, b: unknown): boolean => {
    if(isImmutable(b) || Record.isRecord(b)) {
        return b.equals(a)
    } else if(Array.isArray(b)) {
        return a === b
    } else if(typeof b === 'object') {
        return Object.is(a, b)
    }

    // these should be any scalar values
    return a === b
}

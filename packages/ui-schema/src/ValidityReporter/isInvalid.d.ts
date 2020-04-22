import { Map } from 'immutable'

/**
 * Checks if the `scope` is valid, returns `0` when no error was found
 */
export function isInvalid<K>(
    validity: Map<K, undefined>,
    scope: [],
    count: false
): number

import { Map, OrderedMap } from 'immutable'

/**
 * Handles schema if else then and returns the new merged schema which contains the merged value of `if` and `then`
 */
export function handleIfElseThen<K>(
    // the schema which contains the if / else / then part
    schema: Map<K, undefined> | OrderedMap<K, undefined>,
    // the store which holds the value against which the `distSchema` is validated
    // todo: should be EditorStore?
    store: Map<K, undefined> | OrderedMap<K, undefined>,
    // the schema which must be valid for having `then` applied
    distSchema: Map<K, undefined> | OrderedMap<K, undefined>
): Map<K, undefined> | OrderedMap<K, undefined>

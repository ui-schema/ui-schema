import { OrderedMap, Map } from 'immutable'

export function mergeSchema<K extends {}, V>(
    schema: Map<K, V> | OrderedMap<K, V>,
    dyn_schema: Map<K, V> | OrderedMap<K, V>
): Map<K, V> | OrderedMap<K, V>

import { OrderedMap, Map, List } from 'immutable'

export function validateSchema<K>(
    schema: Map<K, undefined> | OrderedMap<K, undefined>,
    value: Map<K, undefined> | OrderedMap<K, undefined>
): List<[string]>

export function validateSchemaObject<K>(
    schema: Map<K, undefined> | OrderedMap<K, undefined>,
    value: Map<K, undefined> | OrderedMap<K, undefined>
): List<[string | List<K>]>

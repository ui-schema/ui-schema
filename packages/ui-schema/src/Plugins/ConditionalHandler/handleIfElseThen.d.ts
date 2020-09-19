import { Map, OrderedMap } from 'immutable'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

/**
 * Handles schema if else then and returns the new merged schema which contains the merged value of `if` and `then`
 */
export function handleIfElseThen<K>(
    // the schema which contains the if / else / then part
    schema: StoreSchemaType,
    // the store which holds the value against which the `distSchema` is validated
    // todo: should be named `value` not `store`
    store: Map<string | number, any> | OrderedMap<string | number, any>,
    // the schema which must be valid for having `then` applied
    distSchema: StoreSchemaType
): StoreSchemaType

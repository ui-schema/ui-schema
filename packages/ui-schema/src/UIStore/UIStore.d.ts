import { OrderedMap, Map, List, RecordOf } from 'immutable'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { UIStoreActions, UIStoreUpdaterData } from '@ui-schema/ui-schema/UIStoreActions'

export type Values<V> = List<V> | string | number | boolean | Map<string, V> | OrderedMap<string, V>
export type ValuesJS = any[] | string | number | boolean | Object

export interface UIStoreStateData<D = any> {
    values: D
    internals: UIStoreInternalsType
    validity: UIStoreValidityType
    meta: Map<string, any>
}

export interface UIStoreState<D = any> extends UIStoreStateData<D> {
    // returns the values in `values` as pure JS, even when saved as `Map` or `List`
    valuesToJS: () => ValuesJS
    // todo: correct typing `getValues` return value
    getValues: () => D
    getInternals: () => UIStoreInternalsType
    getValidity: () => UIStoreValidityType
    extractValues: <V>(storeKeys: StoreKeys) => {
        value: V | undefined
        internalValue: UIStoreInternalsType | undefined
    }
}

export type UIStoreType<D = any> = RecordOf<UIStoreState<D>>

/**
 * the `internals` are nested for safer generic usage, only the key `internals` is reserved (for nesting)
 * {} = {internals: Map({})}
 * {prop_a: 20} = {internals: Map({
 *     prop_a: Map({internals: Map({})})
 * })}
 */
export type UIStoreInternalsType = Map<string, any>

export type UIStoreValidityType = Map<string | number, any>

export const UIStore: UIStoreType

export type UIStoreUpdaterFn<D extends UIStoreUpdaterData = UIStoreUpdaterData> = (data: D) => D

export type onChangeHandler<A = UIStoreActions> = (actions: A[] | A) => void

// UIMetaContext

// Hooks & HOCs

export function createStore<D = any>(data: D): UIStoreType<D>

export function createEmptyStore(type?: SchemaTypesType): UIStoreType<[] | '' | 0 | false | {}>

// UIStore / Immutable Manipulation Functions

export type KeyType = string | number
/**
 * @deprecated use `KeyType` instead
 */
export type OwnKey = KeyType

export type StoreKeys = List<KeyType>

export function prependKey<O extends KeyType = KeyType, S extends StoreKeys<O>>(storeKeys: S, key: O): S

export function shouldDeleteOnEmpty(value: any, force?: boolean, type?: SchemaTypesType): boolean

export function addNestKey(storeKeysNestedKey: string, storeKeys: StoreKeys): StoreKeys

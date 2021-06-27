import { OrderedMap, Map, List, RecordOf } from 'immutable'
import { updaterFn, updateScope } from '@ui-schema/ui-schema/UIStore/storeUpdater'

export type Values<V> = List<V> | string | number | boolean | Map<string, V> | OrderedMap<string, V>
export type ValuesJS = any[] | string | number | boolean | Object

export interface UIStoreState<D = any> {
    values: D
    internals: Map<string | number, any> | List<any>
    validity: Map<string | number, any>
    // returns the values in `values` as pure JS, even when saved as `Map` or `List`
    valuesToJS: () => ValuesJS
    // todo: correct typing `getValues` return value
    getValues: () => D
    getInternals: () => any
    getValidity: () => Map<string | number, any>
}

export type UIStoreType<D = any> = RecordOf<UIStoreState<D>>

export const UIStore: UIStoreType

export function onChangeHandler(
    storeKeys: StoreKeys,
    scopes: updateScope[],
    updater: updaterFn,
    deleteOnEmpty?: boolean,
    type?: string,
): void

export type onChange = typeof onChangeHandler

// UIMetaContext

// Hooks & HOCs

export function createStore<D = any>(data: D): UIStoreType<D>

export function createEmptyStore(type?: string): UIStoreType<[] | '' | 0 | false | {}>

// UIStore / Immutable Manipulation Functions

export type OwnKey = string | number

export type StoreKeys = List<OwnKey>

export function prependKey<O extends OwnKey = OwnKey, S extends StoreKeys<O>>(storeKeys: S, key: O): S

export function shouldDeleteOnEmpty(value: any, force?: boolean, type?: string): boolean

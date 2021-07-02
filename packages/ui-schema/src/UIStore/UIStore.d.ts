import { OrderedMap, Map, List, RecordOf } from 'immutable'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export type Values<V> = List<V> | string | number | boolean | Map<string, V> | OrderedMap<string, V>
export type ValuesJS = any[] | string | number | boolean | Object

export interface UIStoreStateData<D = any> {
    values: D
    internals: UIStoreInternalsType
    validity: Map<string | number, any>
    meta: Map<string, any>
}

export interface UIStoreState<D = any> extends UIStoreStateData<D> {
    // returns the values in `values` as pure JS, even when saved as `Map` or `List`
    valuesToJS: () => ValuesJS
    // todo: correct typing `getValues` return value
    getValues: () => D
    getInternals: () => UIStoreInternalsType | undefined
    getValidity: () => Map<string | number, any>
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

export const UIStore: UIStoreType

export interface UIStoreUpdaterData {
    value?: any
    internal?: any
    valid?: any
    meta?: any
}

export interface UIStoreAction {
    type: string
    effect?: (newData: UIStoreUpdaterData, newStore: UIStoreType) => void
}

export interface UIStoreActionListItemAdd extends UIStoreAction {
    type: 'list-item-add'
    schema: StoreSchemaType
}

export interface UIStoreActionListItemDelete extends UIStoreAction {
    type: 'list-item-delete'
    index: number
}

export interface UIStoreActionListItemMove extends UIStoreAction {
    type: 'list-item-move'
    fromIndex: number
    toIndex: number
}

export type StoreActions = UIStoreActionListItemAdd | UIStoreActionListItemDelete | UIStoreActionListItemMove

export type UIStoreUpdaterFn<D extends UIStoreUpdaterData = UIStoreUpdaterData> = (data: D) => D

export type onChangeHandlerGeneric<R extends any = void> = (
    storeKeys: StoreKeys,
    scopes: (keyof UIStoreUpdaterData)[],
    updater: UIStoreUpdaterFn | StoreActions,
    deleteOnEmpty?: boolean,
    type?: string,
    config?: {
        [key: string]: any
    },
) => R

export type onChangeHandler = onChangeHandlerGeneric<void>

// UIMetaContext

// Hooks & HOCs

export function createStore<D = any>(data: D): UIStoreType<D>

export function createEmptyStore(type?: string): UIStoreType<[] | '' | 0 | false | {}>

// UIStore / Immutable Manipulation Functions

export type OwnKey = string | number

export type StoreKeys = List<OwnKey>

export function prependKey<O extends OwnKey = OwnKey, S extends StoreKeys<O>>(storeKeys: S, key: O): S

export function shouldDeleteOnEmpty(value: any, force?: boolean, type?: string): boolean

export function addNestKey(storeKeysNestedKey: string, storeKeys: StoreKeys): StoreKeys

import React from 'react'
import { Record, OrderedMap, Map, List } from 'immutable/dist/immutable-nonambient'
import { Translator } from "../Translate/t"
import { StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"
import { WidgetsBindingBase } from '@ui-schema/ui-schema/WidgetsBinding'

// UIStore

export type Values<V> = List<V> | string | number | boolean | Map<V, any> | OrderedMap<V, any>
export type ValuesJS = any[] | string | number | boolean | Object

export interface UIStoreState<D> {
    values: Values<D>
    internals: Map<{}, undefined>
    validity: Map<{}, undefined>
    // returns the values in `values` as pure JS, even when saved as `Map` or `List`
    valuesToJS: () => ValuesJS
    getValues: () => Values<D>
    getInternals: () => any
    getValidity: () => Map<{}, undefined>
}

export type UIStoreType<D = undefined> = Record<UIStoreState<D>> & UIStoreState<D>

export const UIStore: UIStoreType

// UIStoreContext

export type onChangeHandler = (store: UIStoreType<any>) => UIStoreType<any>
export type onChange = (handler: onChangeHandler) => void

export interface UIStoreContext<> {
    store: UIStoreType<any>
    onChange: onChange
    schema: StoreSchemaType
}

export function UIStoreProvider(
    props: React.PropsWithChildren<UIStoreContext>
): React.ReactElement

// UIMetaContext

export interface UIMetaContext<> {
    widgets: WidgetsBindingBase
    t?: Translator
    showValidity?: boolean
}

export function UIMetaProvider(
    props: React.PropsWithChildren<UIMetaContext>
): React.ReactElement

// Hooks & HOCs

export function createStore<D = any>(data: D): UIStoreType<D>

export function createEmptyStore(type?: string): UIStoreType<[] | '' | 0 | false | {}>

export function useUI(): UIStoreContext

export function useUIMeta(): UIMetaContext

// todo: check HOC definitions

export interface WithValue {
    value: any
    internalValue: any
    onChange: onChange
}

export function extractValue<P extends WithValue>(Wrapped: React.ComponentType<P>): React.ComponentType<P>

export interface WithValidity {
    validity: any
    onChange: onChange
}

export function extractValidity(
    WrappedComponent: React.ComponentType<WithValidity>
): React.ComponentType<WithValidity>

export function withUIMeta(
    WrappedComponent: React.ComponentType<UIMetaContext>
): React.ComponentType<UIMetaContext>

// UIStore / Immutable Manipulation Functions

export type ownKey = string | number

export type StoreKeys<T = ownKey> = List<T>

export function prependKey(storeKeys: StoreKeys, key: string | number): StoreKeys

//export function updateRawValue(store: UIStoreType<any>, storeKeys: StoreKeys, key: string | number, value: any): UIStoreType<any>

//export function deleteRawValue(store: UIStoreType<any>, storeKeys: StoreKeys, key: string | number): UIStoreType<any>

export function updateInternalValue(storeKeys: StoreKeys, internalValue: any): onChangeHandler

export function updateValue(storeKeys: StoreKeys, value: any, required?: boolean, type?: string): onChangeHandler

export function updateValues(storeKeys: StoreKeys, value: any, internalValue: any, required?: boolean, type?: string): onChangeHandler

export function updateValidity(storeKeys: StoreKeys, valid: boolean): onChangeHandler

export function cleanUp(storeKeys: StoreKeys, key: string): onChangeHandler

import React from 'react'
import { Record, OrderedMap, Map, List } from 'immutable'

// EditorStoreContext

export type onChangeHandler = (store: EditorStore<any>) => EditorStore<any>
export type onChange = (handler: onChangeHandler) => void

export interface EditorStoreContext<> {
    store: EditorStore<any>
    onChange: onChange
    schema: OrderedMap<{}, undefined>
}

export interface EditorStoreProviderProps<> extends EditorStoreContext {
    children: React.ReactNode
}

export function EditorStoreProvider(
    props: EditorStoreProviderProps
): React.ReactElement

// EditorContext

export interface EditorContext<> {
    widgets: {}
    t?: Function
    showValidity?: boolean
}

export interface EditorProviderProps<> extends EditorContext {
    children: React.ReactNode
}

export function EditorProvider(
    props: EditorProviderProps
): React.ReactElement

// EditorStore

export interface EditorStore<D extends {
    values: any
    internals: Map<{}, undefined>
    validity: Map<{}, undefined>
}> extends Record<D> {
    values: undefined
    internals: Map<{}, undefined>
    validity: Map<{}, undefined>
    getValues: () => any
    getInternals: () => any
    getValidity: () => Map<{}, undefined>
}

export type Values<V> = List<V> | string | number | boolean | Map<V, any> | OrderedMap<V, any>

export function createStore<D = any>(data: D): EditorStore<{
    values: Values<D>
    internals: Map<{}, undefined>
    validity: Map<{}, undefined>
}>

export function createEmptyStore(type?: string): EditorStore<{
    values: Values<[] | '' | 0 | false | {}>
    internals: Map<{}, undefined>
    validity: Map<{}, undefined>
}>

export function useSchemaStore(): EditorStoreContext

export function useEditor(): EditorContext

// todo: check HOC definitions

export interface WithValue {
    value: any
    internalValue: any
    onChange: onChange
}

export function extractValue(
    WrappedComponent: React.ComponentType<WithValue>
): React.ComponentType<WithValue>

export interface WithValidity {
    validity: any
    onChange: onChange
}

export function extractValidity(
    WrappedComponent: React.ComponentType<WithValidity>
): React.ComponentType<WithValidity>

export function withEditor(
    WrappedComponent: React.ComponentType<EditorContext>
): React.ComponentType<EditorContext>

// EditorStore / Immutable Manipulation Functions

export type StoreKeys<T = string[] | number[]> = List<T>

export function prependKey(storeKeys: StoreKeys, key: string | number): StoreKeys

export function updateRawValue(store: EditorStore<any>, storeKeys: StoreKeys, key: string | number, value: any): EditorStore<any>

export function deleteRawValue(store: EditorStore<any>, storeKeys: StoreKeys, key: string | number): EditorStore<any>

export function updateInternalValue(storeKeys: StoreKeys, internalValue: any): onChangeHandler

export function updateValue(storeKeys: StoreKeys, value: any): onChangeHandler

export function updateValues(storeKeys: StoreKeys, value: any, internalValue: any): onChangeHandler

export function updateValidity(storeKeys: StoreKeys, valid: boolean): onChangeHandler

export function cleanUp(storeKeys: StoreKeys, key: string): onChangeHandler

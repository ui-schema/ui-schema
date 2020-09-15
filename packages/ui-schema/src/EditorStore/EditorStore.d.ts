import React from 'react'
import { Record, OrderedMap, Map, List } from 'immutable/dist/immutable-nonambient'
import { Translator } from "../Translate/t"
import { StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"
import { WidgetsBindingBase } from '@ui-schema/ui-schema/WidgetsBinding'

// EditorStore

export type Values<V> = List<V> | string | number | boolean | Map<V, any> | OrderedMap<V, any>
export type ValuesJS = any[] | string | number | boolean | Object

export interface EditorStoreState<D> {
    values: Values<D>
    internals: Map<{}, undefined>
    validity: Map<{}, undefined>
    // returns the values in `values` as pure JS, even when saved as `Map` or `List`
    valuesToJS: () => ValuesJS
    getValues: () => Values<D>
    getInternals: () => any
    getValidity: () => Map<{}, undefined>
}

export type EditorStoreType<D = undefined> = Record<EditorStoreState<D>> & EditorStoreState<D>

export const EditorStore: EditorStoreType

// EditorStoreContext

export type onChangeHandler = (store: EditorStoreType<any>) => EditorStoreType<any>
export type onChange = (handler: onChangeHandler) => void

export interface EditorStoreContext<> {
    store: EditorStoreType<any>
    onChange: onChange
    schema: StoreSchemaType
}

export function EditorStoreProvider(
    props: React.PropsWithChildren<EditorStoreContext>
): React.ReactElement

// EditorContext

export interface EditorContext<> {
    widgets: WidgetsBindingBase
    t?: Translator
    showValidity?: boolean
}

export function EditorProvider(
    props: React.PropsWithChildren<EditorContext>
): React.ReactElement

// Hooks & HOCs

export function createStore<D = any>(data: D): EditorStoreType<D>

export function createEmptyStore(type?: string): EditorStoreType<[] | '' | 0 | false | {}>

export function useSchemaStore(): EditorStoreContext

export function useEditor(): EditorContext

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

export function withEditor(
    WrappedComponent: React.ComponentType<EditorContext>
): React.ComponentType<EditorContext>

// EditorStore / Immutable Manipulation Functions

export type ownKey = string | number

export type StoreKeys<T = ownKey> = List<T>

export function prependKey(storeKeys: StoreKeys, key: string | number): StoreKeys

//export function updateRawValue(store: EditorStoreType<any>, storeKeys: StoreKeys, key: string | number, value: any): EditorStoreType<any>

//export function deleteRawValue(store: EditorStoreType<any>, storeKeys: StoreKeys, key: string | number): EditorStoreType<any>

export function updateInternalValue(storeKeys: StoreKeys, internalValue: any): onChangeHandler

export function updateValue(storeKeys: StoreKeys, value: any, required?: boolean, type?: string): onChangeHandler

export function updateValues(storeKeys: StoreKeys, value: any, internalValue: any, required?: boolean, type?: string): onChangeHandler

export function updateValidity(storeKeys: StoreKeys, valid: boolean): onChangeHandler

export function cleanUp(storeKeys: StoreKeys, key: string): onChangeHandler

import React from 'react'
import { Record, OrderedMap, Map, List } from 'immutable/dist/immutable-nonambient'
import { Translator } from "../Translate/t"
import { StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"

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
    widgets: {}
    t?: Translator
    showValidity?: boolean
}

export function EditorProvider(
    props: React.PropsWithChildren<EditorContext>
): React.ReactElement

// EditorStore

export type Values<V> = List<V> | string | number | boolean | Map<V, any> | OrderedMap<V, any>

export interface EditorStoreState<D> {
    values: D
    internals: Map<{}, undefined>
    validity: Map<{}, undefined>
    getValues: () => Values<any>
    getInternals: () => Values<any>
    getValidity: () => Map<{}, undefined>
}

export type EditorStoreType<D = undefined> = Record<EditorStoreState<D>> & EditorStoreState<D>

export const EditorStore: EditorStoreType

export function createStore<D = any>(data: D): EditorStoreType<Values<D>>

export function createEmptyStore(type?: string): EditorStoreType<Values<[] | '' | 0 | false | {}>>

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

export type StoreKeys<T = ownKey[]> = List<T>

export function prependKey(storeKeys: StoreKeys, key: string | number): StoreKeys

//export function updateRawValue(store: EditorStoreType<any>, storeKeys: StoreKeys, key: string | number, value: any): EditorStoreType<any>

//export function deleteRawValue(store: EditorStoreType<any>, storeKeys: StoreKeys, key: string | number): EditorStoreType<any>

export function updateInternalValue(storeKeys: StoreKeys, internalValue: any): onChangeHandler

export function updateValue(storeKeys: StoreKeys, value: any, required?: boolean, type?: string): onChangeHandler

export function updateValues(storeKeys: StoreKeys, value: any, internalValue: any, required?: boolean, type?: string): onChangeHandler

export function updateValidity(storeKeys: StoreKeys, valid: boolean): onChangeHandler

export function cleanUp(storeKeys: StoreKeys, key: string): onChangeHandler

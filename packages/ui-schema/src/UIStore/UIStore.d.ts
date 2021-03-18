import React from 'react'
import { Record, OrderedMap, Map, List } from 'immutable'
import { Translator } from '../Translate/t'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetsBindingBase } from '@ui-schema/ui-schema/WidgetsBinding'
import { updaterFn, updateScope } from './storeUpdater'

export type Values<V> = List<V> | string | number | boolean | Map<string, V> | OrderedMap<string, V>
export type ValuesJS = any[] | string | number | boolean | Object

export interface UIStoreState<D> {
    values: Values<D>
    internals: Map<string | number, any> | List<any>
    validity: Map<string | number, any>
    // returns the values in `values` as pure JS, even when saved as `Map` or `List`
    valuesToJS: () => ValuesJS
    // todo: correct typing `getValues` return value
    getValues: () => Values<D>
    getInternals: () => any
    getValidity: () => Map<string | number, any>
}

export type UIStoreType<D = any> = Record<UIStoreState<D>> & UIStoreState<D>

export const UIStore: UIStoreType

export function onChangeHandler(
    storeKeys: StoreKeys,
    scopes: updateScope[],
    updater: updaterFn,
    deleteOnEmpty?: boolean,
    type?: string,
): void

export type onChange = typeof onChangeHandler

export interface UIStoreContext<> {
    store: UIStoreType
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

export type OwnKey = string | number

export type StoreKeys<T = OwnKey> = List<T>

export function prependKey(storeKeys: StoreKeys, key: string | number): StoreKeys

export function shouldDeleteOnEmpty(value: any, force?: boolean, type?: string): boolean

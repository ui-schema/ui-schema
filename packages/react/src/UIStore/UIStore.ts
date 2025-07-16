import { Record, Map, List, OrderedMap, RecordOf } from 'immutable'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/ui-schema/schemaTypeIs'
import { getValidity } from './getValidity.js'
import { getValues } from './getValues.js'
import { UIStoreActions, UIStoreUpdaterData } from '@ui-schema/react/UIStoreActions'
import { StoreKeys as ValueStoreKeys } from '@ui-schema/ui-schema/ValueStore'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { Validity } from './UIStoreProvider.js'

export type Values<V> = List<V> | string | number | boolean | Map<string, V> | OrderedMap<string, V>
export type ValuesJS = any[] | string | number | boolean | Object

export interface UIStoreStateData<D = any> {
    values: D
    internals: UIStoreInternalsType | undefined
    validity: UIStoreValidityType | undefined
    meta: Map<string, any>
}

export interface UIStoreState<D = any> extends UIStoreStateData<D> {
    // returns the values in `values` as pure JS, even when saved as `Map` or `List`
    valuesToJS: () => ValuesJS
    // todo: correct typing `getValues` return value
    getValues: () => D
    getInternals: () => UIStoreInternalsType | undefined
    getValidity: () => UIStoreValidityType | undefined
    extractValues: <V>(storeKeys: StoreKeys) => {
        value: V | undefined
        internalValue: UIStoreInternalsType | undefined
    }
    extractValidity: (storeKeys: StoreKeys) => Validity | undefined
}

export type UIStoreTypeFactory<D = any> = Record.Factory<UIStoreState<D>>
export type UIStoreType<D = any> = RecordOf<UIStoreState<D>>

/**
 * Internals store tree.
 *
 * Nested with `.children` and a storeKeys value is scoped to `.self`.
 */
export type UIStoreInternalsType = Map<string, any>

export type UIStoreValidityType = Map<string, unknown>

// todo: based on immutable v5 this should be possible, yet leads to:
//       TS2314: Generic type Map<K, V> requires 2 type argument(s).
// export type UIStoreHierarchyType = Map<{ self: any, children: UIStoreHierarchyType | List<UIStoreHierarchyType> }>

export type UIStoreUpdaterFn<D extends UIStoreUpdaterData = UIStoreUpdaterData> = (data: D) => D

export type onChangeHandler<A = UIStoreActions> = (actions: A[] | A) => void

export type StoreKeyType = string | number

// @todo: replace all usages of this `StoreKeys` with the one from system
export type StoreKeys = ValueStoreKeys

export const UIStore: UIStoreTypeFactory = Record({
    values: undefined,
    // internals must be a map when it is an object in the root, for array a List and for other "any type"
    internals: undefined,
    validity: undefined,
    meta: Map(),
    valuesToJS: function() {
        const values = this.values
        if (Map.isMap(values) || List.isList(values) || Record.isRecord(values)) return values.toJS()

        return values
    },
    getValues: function() {
        return this.values
    },
    getInternals: function() {
        return this.internals
    },
    getValidity: function() {
        return this.validity
    },
    extractValues: function(storeKeys) {
        return getValues(storeKeys, this as UIStoreType)
    },
    extractValidity: function(storeKeys) {
        return getValidity(storeKeys, this.getValidity())
    },
}) as UIStoreTypeFactory

export const createStore = <D = any>(values: D): UIStoreType<D> => {
    return new UIStore({
        values: values,
        // todo: adj. init based on final 0.5.x structure
        internals: undefined,
        // todo: adj. init based on final 0.5.x structure
        validity: undefined,
        meta: Map(),
    }) as UIStoreType<D>
}

/**
 * @todo support multiple types #68
 * @todo include non-evaluating default handling here #118 ?
 *       - would rely on the whole schema
 *       - would work only for basic `default` without conditionals
 *       - could reuse the resource system for walking the schema, instead of the validator
 */
export const createEmptyStore = (type: SchemaTypesType = 'object'): UIStoreType =>
    createStore(
        type === 'array' ?
            List([]) :
            type === 'string' ?
                '' :
                type === 'number' || type === 'integer' ?
                    0 :
                    type === 'boolean' ?
                        false :
                        Map(),
    )

export const prependKey = <
    O extends StoreKeyType = StoreKeyType,
    S extends ValueStoreKeys<StoreKeyType> | StoreKeyType[] = ValueStoreKeys<StoreKeyType> | StoreKeyType[]
>(storeKeys: S, key: O): S =>
    // eslint-disable-next-line indent
    Array.isArray(storeKeys) ?
        [key, ...storeKeys] as S :
        storeKeys.splice(0, 0, key) as S

export const shouldDeleteOnEmpty = (
    value: any,
    force: boolean | undefined,
    type: string | string[] | List<string> | undefined,
) => {
    const valueTypeOf = typeof value
    // todo: mv number out here, enforces that numbers can be cleared, but should only be forced for the `""` value in number types
    if (!force && !schemaTypeIsNumeric(type)) return false

    if (valueTypeOf === 'undefined') return true

    if (
        (schemaTypeIs(type, 'string') && valueTypeOf === 'string') ||
        (schemaTypeIs(type, 'number') && (valueTypeOf === 'number' || valueTypeOf === 'string')) ||
        (schemaTypeIs(type, 'integer') && (valueTypeOf === 'number' || valueTypeOf === 'string'))
    ) {
        return value === '' || (valueTypeOf === 'string' && 0 === value.trim().length)
    } else if (schemaTypeIs(type, 'boolean') && valueTypeOf === 'boolean') {
        return !value
    } else if (schemaTypeIs(type, 'array') && (List.isList(value) || Array.isArray(value))) {
        return (List.isList(value) && value.size === 0) || (Array.isArray(value) && value.length === 0)
    } else if (schemaTypeIs(type, 'object') && (Map.isMap(value) || Record.isRecord(value) || valueTypeOf === 'object')) {
        return ((Map.isMap(value) || Record.isRecord(value)) && value.toSeq().keySeq().size === 0) || (valueTypeOf === 'object' && Object.keys(value).length === 0)
    }

    return false
}

export const addNestKey = (
    storeKeysNestedKey: string,
    storeKeys: (string | number)[] | List<string | number>,
): List<string | number> => {
    const maxI = (Array.isArray(storeKeys) ? storeKeys.length : storeKeys.size) - 1
    return (storeKeys as (string | number)[]).reduce<List<string | number>>((nk, sk, i) => {
        if (i === maxI) return nk.push(sk)
        return nk.push(sk, storeKeysNestedKey)
    }, List([storeKeysNestedKey]))
}

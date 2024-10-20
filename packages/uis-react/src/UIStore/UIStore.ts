import { Record, Map, List, OrderedMap, RecordOf } from 'immutable'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/system/schemaTypeIs'
import { doExtractValues } from '@ui-schema/react/UIStore'
import { UIStoreActions, UIStoreUpdaterData } from '@ui-schema/react/UIStoreActions'
import { StoreKeys as ValueStoreKeys } from '@ui-schema/system/ValueStore'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'

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

export type UIStoreTypeFactory<D = any> = Record.Factory<UIStoreState<D>>
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

export type UIStoreUpdaterFn<D extends UIStoreUpdaterData = UIStoreUpdaterData> = (data: D) => D

export type onChangeHandler<A = UIStoreActions> = (actions: A[] | A) => void

export type StoreKeyType = string | number

// @todo: replace all usages of this `StoreKeys` with the one from system
export type StoreKeys = ValueStoreKeys

// only to enable better minification, DO NOT EXPORT
const STR_INTERNALS = 'internals'
const STR_VALUES = 'values'
const STR_VALIDITY = 'validity'

export const UIStore: UIStoreTypeFactory = Record({
    values: undefined,
    // internals must be an map when it is an object in the root, for array a List and for other "any type"
    internals: Map(),
    validity: Map(),
    meta: Map(),
    valuesToJS: function() {
        // @ts-ignore
        const values = this.get(STR_VALUES)
        if (Map.isMap(values) || List.isList(values) || Record.isRecord(values)) return values.toJS()

        return values
    },
    getValues: function() {
        // @ts-ignore
        return this.get(STR_VALUES)
    },
    getInternals: function() {
        // @ts-ignore
        return this.get(STR_INTERNALS)
    },
    getValidity: function() {
        // @ts-ignore
        return this.get(STR_VALIDITY)
    },
    extractValues: function(storeKeys) {
        // @ts-ignore
        return doExtractValues(storeKeys, this)
    },
}) as UIStoreTypeFactory

export const createStore = <D = any>(values: D): UIStoreType<D> => {
    return new UIStore({
        values: values,
        internals: Map({
            internals: List.isList(values) ? List() : Map(),
        }),
        validity: Map(),
        meta: Map(),
    }) as UIStoreType<D>
}

// todo: support multiple types #68
// todo: adjust UIStoreType to List|OrderedMap|Map instead of []|{}
export const createEmptyStore = (type: SchemaTypesType = 'object'): UIStoreType<[] | '' | 0 | false | {}> =>
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
    ) as UIStoreType

export const prependKey = <O extends StoreKeyType = StoreKeyType, S extends ValueStoreKeys<O> = ValueStoreKeys<O>>(storeKeys: S, key: O): S =>
    Array.isArray(storeKeys) ?
        [key, ...storeKeys] as unknown as S :
        storeKeys.splice(0, 0, key) as S

export const shouldDeleteOnEmpty = (value, force, type) => {
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

export const addNestKey = (storeKeysNestedKey, storeKeys) =>
    storeKeysNestedKey ? storeKeys.reduce((nk, sk) => nk?.concat(sk, List([storeKeysNestedKey])), List([storeKeysNestedKey])).splice(-1, 1) : storeKeys

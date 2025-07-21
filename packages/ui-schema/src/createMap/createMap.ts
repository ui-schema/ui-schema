import { Seq, List, Map, OrderedMap, fromJS } from 'immutable'

export type ValueOrImmutableOrdered<V = any> =
    V extends string | number | boolean | null ? V :
        V extends any[] ? List<ValueOrImmutableOrdered<V[number]>> :
            V extends object ? NestedOrderedMap<V> : V

export type ValueOrImmutable<V = any> =
    V extends string | number | boolean | null ? V :
        V extends any[] ? List<ValueOrImmutable<V[number]>> :
            V extends object ? NestedMap<V> : V

export type NestedOrderedMap<S extends object = object> =
    {
        get: <K extends keyof S = keyof S>(k: K) => ValueOrImmutableOrdered<S[K]>
    } & OrderedMap<keyof S, ValueOrImmutableOrdered<S[keyof S]>>

export type NestedMap<S extends object = object> =
    {
        get: <K extends keyof S = keyof S>(k: K) => ValueOrImmutable<S[K]>
    } & Map<keyof S, ValueOrImmutable<S[keyof S]>>

/**
 * Type inferring version
 * @todo since TS5 often leads to "Type instantiation is excessively deep and possibly infinite.", try using `FromJS<JSValue>` from immutable
 */
export function fromJSOrderedStrict<P>(js: P): ValueOrImmutableOrdered<P> {
    return fromJSOrdered(js) as ValueOrImmutableOrdered<P>
}

/**
 * Type inferring version
 * @todo since TS5 often leads to "Type instantiation is excessively deep and possibly infinite.", try using `FromJS<JSValue>` from immutable
 * @todo: check why since `immutable@4.0.0-alpha` `new List|Map(fromJSOrdered(d))` worked,
 *        at beginning, i think this was required, but why is with `immutable@4.1` `fromJSOrdered(d)` enough and already returns `OrderedMap|List`?
 *        this would mean, `List(fromJSOrdered<P>(data)) | OrderedMap(fromJSOrdered<P>(data))` converts immutable to immutable and thus to wrong data,
 *        but it seems it doesn't? also check immutable docs, as the `fromJSOrdered` was copied either from there or from github
 */
export const createOrderedStrict = <P extends object | any[]>(data: P): ValueOrImmutableOrdered<P> =>
    createOrdered(data) as ValueOrImmutableOrdered<P>
/**
 * Type inferring version
 * @todo since TS5 often leads to "Type instantiation is excessively deep and possibly infinite.", try using `FromJS<JSValue>` from immutable
 */
export const createOrderedMapStrict = <P extends object = object>(data: P): NestedOrderedMap<P> =>
    createOrderedMap(data) as unknown as NestedOrderedMap<P>
/**
 * Type inferring version
 * @todo since TS5 often leads to "Type instantiation is excessively deep and possibly infinite.", try using `FromJS<JSValue>` from immutable
 */
export const createMapStrict = <P extends object = object>(data: P): NestedMap<P> =>
    createMap(data) as unknown as NestedMap<P>

// ---
// untyped versions
// ---

export function fromJSOrdered<P>(js: P): P extends unknown[] ? List<any> : P extends object ? OrderedMap<any, any> : P {
    return (
        typeof js !== 'object' || js === null ? js :
            Array.isArray(js) ?
                Seq(js).map(fromJSOrdered).toList() :
                Seq(js as {}).map(fromJSOrdered).toOrderedMap()
    ) as P extends unknown[] ? List<any> : P extends object ? OrderedMap<any, any> : P
}

export const createOrdered = <P extends object | any[]>(data: P): P extends unknown[] ? List<any> : P extends object ? OrderedMap<any, any> : never => (
    Array.isArray(data) ?
        List(fromJSOrdered(data)) :
        OrderedMap(fromJSOrdered(data))
) as P extends unknown[] ? List<any> : P extends object ? OrderedMap<any, any> : never

export const createOrderedMap = (data?: object): OrderedMap<any, any> =>
    OrderedMap(fromJSOrdered(data))

export const createMap = (data?: object): Map<any, any> =>
    Map(fromJS(data))

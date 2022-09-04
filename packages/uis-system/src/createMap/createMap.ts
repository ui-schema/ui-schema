import { Seq, List, Map, OrderedMap, fromJS, Record } from 'immutable'

export type ValueOrImmutableOrdered<V = any> =
    V extends string | number | boolean | null ? V :
        V extends any[] ? List<ValueOrImmutableOrdered<V[number]>> :
            V extends {} ? NestedOrderedMap<V> : V

export type ValueOrImmutable<V = any> =
    V extends string | number | boolean | null ? V :
        V extends any[] ? List<ValueOrImmutable<V[number]>> :
            V extends {} ? NestedMap<V> : V

export type NestedOrderedMap<S extends {} = {}> =
    {
        get: <K extends keyof S = keyof S>(k: K) => ValueOrImmutableOrdered<S[K]>
    } & OrderedMap<keyof S, ValueOrImmutableOrdered<S[keyof S]>>

export type NestedMap<S extends {} = {}> =
    {
        get: <K extends keyof S = keyof S>(k: K) => ValueOrImmutable<S[K]>
    } & Map<keyof S, ValueOrImmutable<S[keyof S]>>

export function fromJSOrdered<P>(js: P): ValueOrImmutableOrdered<P> {
    if (Map.isMap(js) || OrderedMap.isOrderedMap(js) || List.isList(js) || Record.isRecord(js)) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('converting immutable to immutable may lead to wrong types')
        }
    }

    // @ts-ignore
    return typeof js !== 'object' || js === null ? js :
        Array.isArray(js) ?
            Seq(js).map(fromJSOrdered).toList() as ValueOrImmutableOrdered<P> :
            Seq(js as {}).map(fromJSOrdered).toOrderedMap() as ValueOrImmutableOrdered<P>
}

export const createOrdered = <P extends {} | any[]>(data: P): ValueOrImmutableOrdered<P> =>
    Array.isArray(data) ?
        List(fromJSOrdered(data)) as ValueOrImmutableOrdered<P> :
        OrderedMap(fromJSOrdered(data)) as ValueOrImmutableOrdered<P>

export const createOrderedMap = <P extends {} = {}>(data: P): NestedOrderedMap<P> =>
    OrderedMap(fromJSOrdered(data)) as unknown as NestedOrderedMap<P>

export const createMap = <P extends {} = {}>(data: P): NestedMap<P> =>
    Map(fromJS(data)) as unknown as NestedMap<P>

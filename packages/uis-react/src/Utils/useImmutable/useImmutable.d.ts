import { List, Map } from 'immutable'

/*
 * If the value passed in is structurally equal to the one saved in the ref,
 * it will return the one saved in the ref to preserve reference equality
 */
export function useImmutable<T = List<any> | Map<any, any> | any>(value: T): T

import { List } from 'immutable'

export type StoreKeyType = string | number

export type StoreKeys<O extends StoreKeyType = StoreKeyType> = List<O>

export type StoreKeysArrayOrList<O extends StoreKeyType = StoreKeyType> = List<O> | O[]

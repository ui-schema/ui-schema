import { List } from 'immutable'

export type StoreKeyType = string | number

export type StoreKeys<O extends StoreKeyType = StoreKeyType> = List<O>
// export type StoreKeys = List<StoreKeyType> | StoreKeyType[]

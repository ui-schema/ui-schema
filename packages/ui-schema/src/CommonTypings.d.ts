import { OrderedMap, List } from 'immutable'

export type showValidity = boolean
export type errors = List<string>
export type required = boolean
export type valid = boolean
export type StoreSchemaType = OrderedMap<any, any>

import { Map, List } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export type showValidity = boolean

export type StoreSchemaTypeValuesJS = string | number | boolean | null | any[] | undefined | { [key: string]: StoreSchemaTypeValuesJS }

export type StoreSchemaTypeValues = UISchemaMap | List<any> | Map<any, any> | StoreSchemaTypeValuesJS

export type SchemaTypesType = List<string> | string | undefined

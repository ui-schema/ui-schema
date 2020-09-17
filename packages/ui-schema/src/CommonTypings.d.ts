import { List, OrderedMap } from 'immutable/dist/immutable-nonambient'
import { ValidatorErrorsType } from '@ui-schema/ui-schema/ValidatorStack/ValidatorErrors'
import { JsonSchema, JsonSchemaKeys, JsonSchemaKeyValue } from '@ui-schema/ui-schema/JsonSchema'

export type showValidity = boolean
export type errors = ValidatorErrorsType
export type required = boolean
export type valid = boolean

export interface StoreSchemaTypeValue {
    items: StoreSchemaType | List<StoreSchemaType>
}

export interface StoreSchemaType extends OrderedMap {
    toJS(): JsonSchema

    has<K extends JsonSchemaKeys>(key: K): boolean

    hasIn<K extends JsonSchemaKeys>(keyPath: Iterable<K>): boolean

    // todo: `get` and `getIn` mostly resolve tu `unkown` and not the actual value wanted
    //       shouldn't `JsonSchemaPure[K]` be enough?
    // todo: if the type was a nested JsonSchema, it actually must be another StoreSchemaType, as `return`
    get<K extends JsonSchemaKeys>(key: K): JsonSchemaKeyValue<K> | StoreSchemaTypeValue[K]

    // todo: if the type was a nested JsonSchema, it actually must be another StoreSchemaType, as `return`
    getIn<K extends JsonSchemaKeys>(keyPath: Iterable<K>): JsonSchemaKeyValue<K> | StoreSchemaTypeValue[K]

    getIn<K extends JsonSchemaKeys>(keyPath: Iterable<K>, notSetValue?: any): any

    delete<K extends JsonSchemaKeys>(key: K): this

    deleteIn<K extends JsonSchemaKeys>(keyPath: Iterable<K>): this

    removeIn<K extends JsonSchemaKeys>(keyPath: Iterable<K>): this

    // todo: if the type was a nested JsonSchema, it actually must be another StoreSchemaType as `value`
    set<K extends JsonSchemaKeys>(key: K, value: JsonSchemaKeyValue<K> | StoreSchemaTypeValue[K]): this

    setIn<K extends JsonSchemaKeys>(keyPath: Iterable<K>, value: any): this

    update<K extends JsonSchemaKeys>(key: K, notSetValue: any, updater: (value: any) => any): this

    update<K extends JsonSchemaKeys>(key: K, updater: (value: any) => any): this

    updateIn<K extends JsonSchemaKeys>(keyPath: Iterable<K>, notSetValue: any, updater: (value: any) => any): this

    updateIn<K extends JsonSchemaKeys>(keyPath: Iterable<K>, updater: (value: any) => any): this
}

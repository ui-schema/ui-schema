import { Map, List, OrderedMap } from 'immutable'
import { ValidatorErrorsType } from '@ui-schema/ui-schema/ValidatorStack/ValidatorErrors'
import { OwnKey } from '@ui-schema/ui-schema/UIStore'
// import { JsonSchema, JsonSchemaKeys, JsonSchemaKeyValue } from '@ui-schema/ui-schema/JsonSchema'

export type showValidity = boolean
export type Errors = ValidatorErrorsType
export type required = boolean
export type valid = boolean

export type StoreSchemaTypeValuesJS = string | number | boolean | null | any[] | undefined | { [key: string]: StoreSchemaTypeValuesJS }

export type StoreSchemaTypeValues = StoreSchemaType | List<any> | Map<any, any> | StoreSchemaTypeValuesJS

export type StoreSchemaType = OrderedMap<OwnKey, StoreSchemaTypeValues>

//export type StoreSchemaType = OrderedMapTyping<string, StoreSchemaType | string>

/*export interface StoreSchemaType extends OrderedMapTyping<string, StoreSchemaType | string> {
    get<K extends JsonSchemaKeys>(key: K): {
        properties: StoreSchemaType
    }
}*/

/*export interface StoreSchemaType extends OrderedMapTyping<string, StoreSchemaType> {
    toJS<K>(): K[]
    // toJS(): Array<any>;
}*/

/*
export interface StoreSchemaTypeValue {
    items: StoreSchemaType | List<StoreSchemaType>
}

export interface StoreSchemaType extends OrderedMap<string, {}> {
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
*/

import { StoreKeys, StoreSchemaType, UIStoreType, UIStoreUpdaterFn } from '@ui-schema/ui-schema'

export interface UIStoreUpdaterData {
    value?: any
    internal?: any
    valid?: any
    meta?: any
}

export interface UIStoreActionScoped {
    storeKeys: StoreKeys
    scopes: (keyof UIStoreUpdaterData)[]
    effect?: (newData: UIStoreUpdaterData, newStore: UIStoreType) => void
}

export interface UIStoreAction {
    type: string
    schema?: StoreSchemaType
    required?: boolean
}

export type UIStoreActionListItemAdd = UIStoreActionListItemAddWithValue | UIStoreActionListItemAddWithSchema

export interface UIStoreActionListItemAddWithValue extends UIStoreAction {
    type: 'list-item-add'
    itemValue: any
}

export interface UIStoreActionListItemAddWithSchema extends UIStoreAction {
    type: 'list-item-add'
    schema: StoreSchemaType
}

export interface UIStoreActionListItemDelete extends UIStoreAction {
    type: 'list-item-delete'
    index: number
}

export interface UIStoreActionListItemMove extends UIStoreAction {
    type: 'list-item-move'
    fromIndex: number
    toIndex: number
}

export interface UIStoreActionUpdate extends UIStoreAction {
    type: 'update'
    updater: UIStoreUpdaterFn
}

export interface UIStoreActionSet extends UIStoreAction {
    type: 'set'
    data: UIStoreUpdaterData
}

export type StoreActions = UIStoreActionScoped & (
    UIStoreActionListItemAdd |
    UIStoreActionListItemDelete |
    UIStoreActionListItemMove |
    UIStoreActionUpdate |
    UIStoreActionSet
    )

export type StoreActionDefinite =
    UIStoreActionListItemAdd |
    UIStoreActionListItemDelete |
    UIStoreActionListItemMove |
    UIStoreActionUpdate |
    UIStoreActionSet

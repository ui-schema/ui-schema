import { StoreKeys, StoreSchemaType, UIStoreType, UIStoreUpdaterFn } from '@ui-schema/ui-schema'

export interface UIStoreUpdaterData {
    value?: any
    internal?: any
    valid?: any
    meta?: any
}

export type UIStoreActionScoped<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> = {
    storeKeys: StoreKeys
    scopes: (keyof D)[]
    effect?: (newData: D, newStore: S) => void
}

export interface UIStoreAction extends UIStoreActionScoped {
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

export interface UIStoreActionSet<D extends UIStoreUpdaterData = UIStoreUpdaterData> extends UIStoreAction {
    type: 'set'
    data: D
}

export type UIStoreActions =
    UIStoreActionListItemAdd |
    UIStoreActionListItemDelete |
    UIStoreActionListItemMove |
    UIStoreActionUpdate |
    UIStoreActionSet


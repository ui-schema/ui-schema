import { UIStoreType, UIStoreUpdaterFn } from '@ui-schema/react/UIStore'
import { UISchemaMap } from '@ui-schema/system/Definitions'
import { StoreKeys } from '@ui-schema/system/ValueStore'

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

export interface UIStoreAction<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> extends UIStoreActionScoped<S, D> {
    type: string
    schema?: UISchemaMap
    required?: boolean
}

export interface UIStoreActionListItemAddWithValue<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> extends UIStoreAction<S, D> {
    type: 'list-item-add'
    itemValue: any
}

export interface UIStoreActionListItemAddWithSchema<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> extends UIStoreAction<S, D> {
    type: 'list-item-add'
    schema: UISchemaMap
}

export type UIStoreActionListItemAdd<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> =
    UIStoreActionListItemAddWithValue<S, D> |
    UIStoreActionListItemAddWithSchema<S, D>

export interface UIStoreActionListItemDelete<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> extends UIStoreAction<S, D> {
    type: 'list-item-delete'
    index: number
}

export interface UIStoreActionListItemMove<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> extends UIStoreAction<S, D> {
    type: 'list-item-move'
    fromIndex: number
    toIndex: number
}

export interface UIStoreActionUpdate<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> extends UIStoreAction<S, D> {
    type: 'update'
    updater: UIStoreUpdaterFn<D>
}

export interface UIStoreActionSet<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> extends UIStoreAction<S, D> {
    type: 'set'
    data: D
}

export type UIStoreActions<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> =
    UIStoreActionListItemAdd<S, D> |
    UIStoreActionListItemDelete<S, D> |
    UIStoreActionListItemMove<S, D> |
    UIStoreActionUpdate<S, D> |
    UIStoreActionSet<S, D>


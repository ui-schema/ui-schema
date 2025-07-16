import type { UIStoreType, UIStoreUpdaterFn } from '@ui-schema/react/UIStore'
import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import type { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import type { Map } from 'immutable'

export interface UIStoreUpdaterData {
    value?: any

    internal?: any

    /**
     * The validity for this node, for backwards compatible either a boolean or an object.
     * @todo simplify structure in a future release, after the store and validity part is no longer using immutable
     */
    valid?: boolean | { valid?: boolean, errors?: any } | Map<any, any>

    meta?: any
}

export type UIStoreActionScoped<D extends UIStoreUpdaterData = UIStoreUpdaterData> = {
    /**
     * @todo move into the actions which support this, e.g. all `list-*` reducers rely on `internals`
     */
    scopes: (keyof D)[]
}

export interface UIStoreAction<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> {
    storeKeys: StoreKeys
    type: string
    schema?: SomeSchema
    required?: boolean
    /**
     * @deprecated use normal react flow and effects instead
     */
    effect?: (newData: D, newStore: S) => void
}

export interface UIStoreActionListItemAddWithValue<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> extends UIStoreAction<S, D> {
    type: 'list-item-add'
    itemValue: any
}

export interface UIStoreActionListItemAddWithSchema<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> extends UIStoreAction<S, D> {
    type: 'list-item-add'
    schema: SomeSchema
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

export interface UIStoreActionUpdate<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> extends UIStoreActionScoped<D>, UIStoreAction<S, D> {
    type: 'update'
    updater: UIStoreUpdaterFn<D>
}

export interface UIStoreActionSet<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> extends UIStoreActionScoped<D>, UIStoreAction<S, D> {
    type: 'set'
    data: D
}

export interface UIStoreActionDelete<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> extends Partial<UIStoreActionScoped<D>>, UIStoreAction<S, D> {
    type: 'delete'
}

export type UIStoreActions<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData> =
    UIStoreActionListItemAdd<S, D> |
    UIStoreActionListItemDelete<S, D> |
    UIStoreActionListItemMove<S, D> |
    UIStoreActionUpdate<S, D> |
    UIStoreActionSet<S, D> |
    UIStoreActionDelete<S, D>

export function isAffectingValue<S extends Omit<UIStoreAction, 'effect'> | (Omit<UIStoreAction, 'effect'> & UIStoreActionScoped)>(action: S) {
    if ('scopes' in action && action.scopes) {
        return action.scopes.includes('value')
    }
    // when not a scoped action, it is expected that the action mutates all scopes
    return true
}

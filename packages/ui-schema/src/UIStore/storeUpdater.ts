import {
    StoreKeys, UIStoreType,
    prependKey, addNestKey,
    UIStoreStateData, UIStoreUpdaterData, StoreActions,
} from '@ui-schema/ui-schema/UIStore/UIStore'
import { scopeUpdaterValidity } from '@ui-schema/ui-schema/UIStore/scopeUpdaterValidity'
import { scopeUpdaterInternals } from '@ui-schema/ui-schema/UIStore/scopeUpdaterInternals'
import { scopeUpdaterValues } from '@ui-schema/ui-schema/UIStore/scopeUpdaterValues'
import { actionHandler } from '@ui-schema/ui-schema/UIStore/storeActionHandler'
import { storeUpdaterCreate, storeUpdaterType } from '@ui-schema/ui-schema/UIStore/storeUpdaterCreate'

const getScopedValueFactory = (scope: keyof UIStoreStateData, nestKey?: string) =>
    <S extends UIStoreType>(storeKeys: StoreKeys, store: S) =>
        store.getIn(
            storeKeys.size ?
                prependKey(nestKey ? addNestKey(nestKey, storeKeys) : storeKeys, scope)
                : [scope]
        )

export type ScopeOnChangeHandlerInternal = <S extends UIStoreType>(
    store: S,
    scope: keyof UIStoreStateData,
    storeKeys: StoreKeys,
    newValue: any
) => S

export type ScopeOnChangeHandler = <S extends UIStoreType>(
    store: S, storeKeys: StoreKeys,
    oldValue: any, newValue: any,
    action: StoreActions | undefined
) => S

export type ScopeUpdaterMapType = {
    [k in keyof UIStoreUpdaterData]: {
        handler: ScopeOnChangeHandler
        getter: <S extends UIStoreType>(storeKeys: StoreKeys, store: S) => any
    }
}

const scopeUpdaterMap: ScopeUpdaterMapType = {
    value: {
        // `store.values`
        handler: scopeUpdaterValues,
        getter: getScopedValueFactory('values'),
    },
    internal: {
        // `store.internals`
        handler: scopeUpdaterInternals,
        getter: getScopedValueFactory('internals', 'internals'),
    },
    valid: {
        // `store.validity`
        handler: scopeUpdaterValidity,
        getter: getScopedValueFactory('validity'),
    },
    meta: {
        // `store.meta`
        handler: (store, _storeKeys, _oldValue, newValue) => store.set('meta', newValue),
        getter: (_storeKeys, store) => store.meta,
    },
}

export const storeUpdater: storeUpdaterType = storeUpdaterCreate(actionHandler, scopeUpdaterMap)

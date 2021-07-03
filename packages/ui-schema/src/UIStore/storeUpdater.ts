import {
    StoreKeys, UIStoreType,
    prependKey, addNestKey,
    UIStoreStateData,
    UIStoreUpdaterFn, onChangeHandlerGeneric,
    UIStoreAction, UIStoreUpdaterData,
} from '@ui-schema/ui-schema/UIStore/UIStore'
import { scopeUpdaterValidity } from '@ui-schema/ui-schema/UIStore/scopeUpdaterValidity'
import { scopeUpdaterInternals } from '@ui-schema/ui-schema/UIStore/scopeUpdaterInternals'
import { scopeUpdaterValues } from '@ui-schema/ui-schema/UIStore/scopeUpdaterValues'
import { actionHandler } from '@ui-schema/ui-schema/UIStore/storeActionHandler'

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
    config?: {
        [key: string]: any
    }
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

export type storeUpdaterType = onChangeHandlerGeneric<<T extends UIStoreType>(store: T) => T>

export const storeUpdater: storeUpdaterType = (
    storeKeys,
    scopes,
    updaterOrAction,
    deleteOnEmpty,
    type
) =>
    <T extends UIStoreType>(store: T): T => {
        let updaterFn: UIStoreUpdaterFn
        let effect: UIStoreAction['effect'] | undefined
        if (typeof updaterOrAction === 'object') {
            updaterFn = actionHandler(updaterOrAction)
            effect = updaterOrAction.effect
        } else {
            updaterFn = updaterOrAction
        }

        const values: { [k: string]: any } = {}
        scopes.forEach(scope => {
            const scopeUpdater = scopeUpdaterMap[scope]
            if (!scopeUpdater) {
                console.error('try to update unknown scope:', scope)
                return
            }
            values[scope] = scopeUpdater.getter(storeKeys, store)
        })

        const res = updaterFn({...values})

        scopes.forEach(scope => {
            const scopeUpdater = scopeUpdaterMap[scope]
            if (!scopeUpdater) {
                console.error('try to update unknown scope:', scope)
                return
            }
            store = scopeUpdater.handler(
                store, storeKeys,
                values[scope], res[scope],
                {deleteOnEmpty: Boolean(deleteOnEmpty), type}
            )
        })

        if (effect) {
            effect(res, store)
        }

        return store
    }

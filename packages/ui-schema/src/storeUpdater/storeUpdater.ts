import {
    StoreKeys, UIStoreType,
    prependKey, addNestKey,
    UIStoreStateData, onChangeHandler,
} from '@ui-schema/ui-schema/UIStore'
import { actionHandler } from '@ui-schema/ui-schema/storeUpdater/storeActionHandler'
import { scopeUpdaterValues, scopeUpdaterInternals, scopeUpdaterValidity } from '@ui-schema/ui-schema/storeScopeUpdater'
import { UIStoreActions, UIStoreUpdaterData } from '@ui-schema/ui-schema/UIStoreActions'

// todo: unify this type and the `setter` in `ScopeUpdaterMapType`
export type ScopeOnChangeHandler<S extends UIStoreType = UIStoreType, A extends UIStoreActions = UIStoreActions> = (
    store: S,
    storeKeys: StoreKeys,
    newValue: any,
    action?: A | undefined
) => S

export type ScopeUpdaterMapType<D extends UIStoreUpdaterData = UIStoreUpdaterData> = {
    [k in keyof D]: {
        setter: <S extends UIStoreType, A extends UIStoreActions = UIStoreActions>(
            store: S,
            storeKeys: StoreKeys,
            newValue: any,
            action?: A | undefined
        ) => S
        getter: <S extends UIStoreType>(storeKeys: StoreKeys, store: S) => any
    }
}

export type storeUpdaterType<S extends UIStoreType = UIStoreType, A extends UIStoreActions = UIStoreActions> = onChangeHandler<(store: S) => S, A>

const getScopedValueFactory = (scope: keyof UIStoreStateData, nestKey?: string) =>
    <S extends UIStoreType>(storeKeys: StoreKeys, store: S) =>
        store.getIn(
            storeKeys.size ?
                prependKey(nestKey ? addNestKey(nestKey, storeKeys) : storeKeys, scope)
                : [scope]
        )

export const scopeUpdaterMap: ScopeUpdaterMapType = {
    value: {
        // `store.values`
        // @ts-ignore
        setter: scopeUpdaterValues,
        getter: getScopedValueFactory('values'),
    },
    internal: {
        // `store.internals`
        // @ts-ignore
        setter: scopeUpdaterInternals,
        getter: getScopedValueFactory('internals', 'internals'),
    },
    valid: {
        // `store.validity`
        // @ts-ignore
        setter: scopeUpdaterValidity,
        getter: getScopedValueFactory('validity'),
    },
    meta: {
        // `store.meta`
        setter: (store, _storeKeys, newValue) => store.set('meta', newValue),
        getter: (_storeKeys, store) => store.meta,
    },
}

export const storeUpdater =
    <S extends UIStoreType = UIStoreType,
        A extends UIStoreActions = UIStoreActions>(
        actions: A[] | A
    ) => (
        store: S
    ): S => {
        if (!Array.isArray(actions)) {
            actions = [actions]
        }
        store = actions.reduce((store, action) => {
            const {scopes, effect, storeKeys} = action

            // @ts-ignore
            const scopeUpdater: ScopeUpdaterMapType = {}
            scopes.forEach(scope => {
                if (!scopeUpdaterMap[scope]) {
                    throw new Error('scopeUpdater for `' + scope + '` not found')
                }
                scopeUpdater[scope] = scopeUpdaterMap[scope]
            })

            const handler = actionHandler<A>(action)
            let res: UIStoreUpdaterData
            if (typeof handler === 'function') {
                // @ts-ignore
                const values: UIStoreUpdaterData = {}

                scopes.forEach(scope => {
                    values[scope] = scopeUpdater[scope]?.getter(storeKeys, store)
                })

                res = handler(values)
            } else {
                res = handler
            }

            scopes.forEach(scope => {
                store = scopeUpdater[scope]?.setter(
                    store, storeKeys,
                    res[scope],
                    action,
                ) || store
            })

            if (effect) {
                effect(res, store)
            }

            return store
        }, store)

        return store
    }

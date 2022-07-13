import {
    StoreKeys, UIStoreType,
    prependKey, addNestKey,
    UIStoreStateData, UIStoreUpdaterFn,
} from '@ui-schema/react/UIStore'
import { scopeUpdaterValues, scopeUpdaterInternals, scopeUpdaterValidity } from '@ui-schema/react/storeScopeUpdater'
import { UIStoreAction, UIStoreActions, UIStoreUpdaterData } from '@ui-schema/react/UIStoreActions'
import { storeActionReducers } from '@ui-schema/react/storeUpdater'

// todo: unify this type and the `setter` in `ScopeUpdaterMapType`
export type ScopeOnChangeHandler<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData, A = UIStoreActions<S, D>> = (
    store: S,
    storeKeys: StoreKeys,
    newValue: any,
    action?: A | undefined
) => S

export type ScopeUpdaterMapType<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData, A = UIStoreActions<S, D>> = {
    [k in keyof D]: ({
        setter: <S extends UIStoreType>(
            store: S,
            storeKeys: StoreKeys,
            newValue: any,
            action?: A | undefined
        ) => S
        getter: <S extends UIStoreType>(storeKeys: StoreKeys, store: S) => any
    } | {
        /**
         * experimental, skips the store setter/getter for a specific scope
         */
        noStore: true
    })
}

export const getScopedValueFactory = <D extends UIStoreStateData = UIStoreStateData>(scope: keyof D, nestKey?: string) =>
    <S extends UIStoreType>(storeKeys: StoreKeys, store: S) =>
        store.getIn(
            storeKeys.size ?
                prependKey(nestKey ?
                    addNestKey(nestKey, storeKeys) :
                    storeKeys, scope as string) :
                [scope]
        )

export const scopeUpdaterMapDefault: ScopeUpdaterMapType = {
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

export const createStoreUpdater = <S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData, A extends UIStoreAction<S, D> = UIStoreActions<S, D>, SM extends ScopeUpdaterMapType<S, D, A> = ScopeUpdaterMapType<S, D, A>>(
    actionReducers: (action: A) => UIStoreUpdaterFn<D> | D,
    scopeUpdaterMap: SM,
) => {
    return (actions: A[] | A) => {
        if (!Array.isArray(actions)) {
            actions = [actions]
        }
        return (oldStore: S): S =>
            (actions as A[]).reduce((store, action) => {
                const {scopes, effect, storeKeys} = action

                const scopeUpdater: SM = scopes.reduce((su, scope) => {
                    if (!scopeUpdaterMap[scope]) {
                        throw new Error('scopeUpdater for `' + scope + '` not found')
                    }
                    su[scope] = scopeUpdaterMap[scope]
                    return su
                }, {} as SM)

                const handler = actionReducers(action)
                let res: D
                if (typeof handler === 'function') {
                    const values: D = scopes.reduce((vs, scope) => {
                        const su = scopeUpdater[scope]
                        if (!su || ('noStore' in su && su.noStore)) return vs
                        if ('getter' in su) {
                            vs[scope] = su.getter(storeKeys, store)
                        }
                        return vs
                    }, {} as D)

                    res = handler(values) as D
                } else {
                    res = handler
                }

                store = scopes.reduce((s, scope) => {
                    const su = scopeUpdater[scope]
                    if (!su || ('noStore' in su && su.noStore)) return s
                    if ('setter' in su) {
                        s = su.setter(
                            s, storeKeys,
                            res[scope],
                            action,
                        )
                    }

                    return s
                }, store)

                if (effect) {
                    effect(res, store)
                }

                return store
            }, oldStore)
    }
}

export const storeUpdater =
    <S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData, A extends UIStoreActions<S, D> = UIStoreActions<S, D>>(
        actions: A[] | A
    ) => {
        return createStoreUpdater<S, D, A>(
            storeActionReducers as (action: A) => UIStoreUpdaterFn<D> | D,
            scopeUpdaterMapDefault as ScopeUpdaterMapType<S, D, A>,
        )(actions)
    }

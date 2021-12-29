import { StoreActionDefinite, UIStoreActionScoped, UIStoreUpdaterData } from '@ui-schema/ui-schema/UIStoreActions'
import { onChangeHandler, StoreKeys, UIStoreType, UIStoreUpdaterFn } from '@ui-schema/ui-schema/UIStore'

export type ScopeOnChangeHandler<S extends UIStoreType = UIStoreType, A extends StoreActionDefinite = StoreActionDefinite> = (
    store: S,
    storeKeys: StoreKeys,
    newValue: any,
    action?: A | undefined
) => S

export type ScopeUpdaterMapType<D extends UIStoreUpdaterData = UIStoreUpdaterData, A extends StoreActionDefinite = StoreActionDefinite, S extends UIStoreType = UIStoreType> = {
    [k in keyof D]: {
        setter: ScopeOnChangeHandler<S, A>
        getter: (storeKeys: StoreKeys, store: S) => any
    }
}

export type storeUpdaterType<S extends UIStoreType = UIStoreType, A extends StoreActionDefinite = StoreActionDefinite> = onChangeHandler<(store: S) => S, A>

export const storeUpdaterCreate =
    <A extends StoreActionDefinite = StoreActionDefinite,
        D extends UIStoreUpdaterData = UIStoreUpdaterData,
        S extends UIStoreType = UIStoreType,
        SU extends ScopeUpdaterMapType<D, A, S> = ScopeUpdaterMapType<D, A, S>,
        SA extends UIStoreActionScoped<D, S> = UIStoreActionScoped<D, S>>(
        actionHandler: (action: A) => UIStoreUpdaterFn<D> | D,
        scopeUpdaterMap: SU,
    ) => (
        actions: (A & SA)[] | (A & SA)
    ) => (
        store: S
    ): S => {
        if (!Array.isArray(actions)) {
            actions = [actions]
        }
        store = actions.reduce((store, action) => {
            const {scopes, effect, storeKeys, ...definiteAction} = action

            // @ts-ignore
            const scopeUpdater: SU = {}
            scopes.forEach(scope => {
                if (!scopeUpdaterMap[scope]) {
                    throw new Error('scopeUpdater for `' + scope + '` not found')
                }
                scopeUpdater[scope] = scopeUpdaterMap[scope]
            })

            const handler = actionHandler(definiteAction as unknown as A)
            let res: D
            if (typeof handler === 'function') {
                // @ts-ignore
                const values: D = {}

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
                    definiteAction as unknown as A,
                ) || store
            })

            if (effect) {
                effect(res, store)
            }

            return store
        }, store)

        return store
    }

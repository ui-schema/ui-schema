import { StoreActionDefinite, UIStoreUpdaterData } from '@ui-schema/ui-schema/UIStoreActions'
import { onChangeHandlerGeneric, StoreKeys, UIStoreType, UIStoreUpdaterFn } from '@ui-schema/ui-schema/UIStore'

export type ScopeOnChangeHandler = <S extends UIStoreType>(
    store: S,
    storeKeys: StoreKeys,
    newValue: any,
    action?: StoreActionDefinite | undefined
) => S

export type ScopeUpdaterMapType = {
    [k in keyof UIStoreUpdaterData]: {
        setter: ScopeOnChangeHandler
        getter: <S extends UIStoreType>(storeKeys: StoreKeys, store: S) => any
    }
}

export type storeUpdaterType = onChangeHandlerGeneric<<T extends UIStoreType>(store: T) => T>

export const storeUpdaterCreate: (
    actionHandler: (action: StoreActionDefinite) => UIStoreUpdaterFn | UIStoreUpdaterData,
    scopeUpdaterMap: ScopeUpdaterMapType
) => storeUpdaterType = (
    actionHandler,
    scopeUpdaterMap,
) => (
    actions
) => <T extends UIStoreType>(
    store: T
): T => {
    if (!Array.isArray(actions)) {
        actions = [actions]
    }
    store = actions.reduce((store, action) => {
        const {scopes, effect, storeKeys, ...definiteAction} = action

        const scopeUpdater: ScopeUpdaterMapType = {}
        scopes.forEach(scope => {
            if (!scopeUpdaterMap[scope]) {
                throw new Error('scopeUpdater for `' + scope + '` not found')
            }
            scopeUpdater[scope] = scopeUpdaterMap[scope]
        })

        const handler = actionHandler(definiteAction)
        let res: UIStoreUpdaterData
        if (typeof handler === 'function') {
            const values: { [k: string]: any } = {}

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
                definiteAction,
            ) || store
        })

        if (effect) {
            effect(res, store)
        }

        return store
    }, store)

    return store
}

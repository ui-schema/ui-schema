import { onChangeHandlerGeneric, ScopeUpdaterMapType, StoreActions, UIStoreType, UIStoreUpdaterFn } from '@ui-schema/ui-schema'

export type storeUpdaterType = onChangeHandlerGeneric<<T extends UIStoreType>(store: T) => T>

export const storeUpdaterCreate: (
    actionHandler: (action: StoreActions) => UIStoreUpdaterFn,
    scopeUpdaterMap: ScopeUpdaterMapType
) => storeUpdaterType = (actionHandler, scopeUpdaterMap) => (
    storeKeys,
    scopes,
    updaterOrAction
) => <T extends UIStoreType>(store: T): T => {
    if (typeof updaterOrAction !== 'object') {
        updaterOrAction = {
            type: 'update',
            updater: updaterOrAction,
        }
    }

    const values: { [k: string]: any } = {}
    const scopeUpdater: ScopeUpdaterMapType = {}
    scopes.forEach(scope => {
        if (!scopeUpdaterMap[scope]) {
            throw new Error('scopeUpdater for `' + scope + '` not found')
        }
        scopeUpdater[scope] = scopeUpdaterMap[scope]
    })
    scopes.forEach(scope => {
        // @ts-ignore
        values[scope] = scopeUpdater[scope].getter(storeKeys, store)
    })

    const effect = updaterOrAction.effect
    const res = actionHandler(updaterOrAction)(values)

    scopes.forEach(scope => {
        // @ts-ignore
        store = scopeUpdater[scope].handler(
            store, storeKeys,
            values[scope], res[scope],
            updaterOrAction as StoreActions
        )
        console.log('store at ' + scope, store?.toJS())
    })

    if (effect) {
        effect(res, store)
    }

    return store
}

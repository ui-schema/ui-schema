import { prependKey } from '@ui-schema/ui-schema/UIStore/UIStore'
import { ScopeOnChangeHandlerInternal } from '@ui-schema/ui-schema/UIStore/storeUpdater'

export const updateStoreScope: ScopeOnChangeHandlerInternal = (store, scope, storeKeys, newValue) => {
    store = store.setIn(
        storeKeys.size ? prependKey(storeKeys, scope) : [scope],
        newValue
    )
    return store
}

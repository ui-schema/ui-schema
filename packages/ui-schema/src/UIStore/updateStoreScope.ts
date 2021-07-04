import { prependKey } from '@ui-schema/ui-schema/UIStore/UIStore'
import { ScopeOnChangeHandlerInternal } from '@ui-schema/ui-schema/UIStore/storeUpdater'

export const updateStoreScope: ScopeOnChangeHandlerInternal = (store, scope, storeKeys, newValue) => {
    return store.setIn(
        storeKeys.size ? prependKey(storeKeys, scope) : [scope],
        newValue
    )
}

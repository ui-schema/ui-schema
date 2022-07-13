import { addNestKey } from '@ui-schema/react/UIStore'
import { ScopeOnChangeHandler } from '@ui-schema/react/storeUpdater'
import { updateStoreScope } from '@ui-schema/react/storeScopeUpdater'
import { storeBuildScopeTree } from '@ui-schema/react/storeBuildScopeTree'

export const scopeUpdaterInternals: ScopeOnChangeHandler = (store, storeKeys, newValue) => {
    //if (typeof oldValue === 'undefined') {
    // initializing the tree for correct data types
    // https://github.com/ui-schema/ui-schema/issues/119
    store = storeBuildScopeTree(storeKeys, 'internals', store, 'internals', false)
    //}
    return updateStoreScope(
        store, 'internals', storeKeys.size ? addNestKey('internals', storeKeys) : storeKeys,
        newValue
    )
}

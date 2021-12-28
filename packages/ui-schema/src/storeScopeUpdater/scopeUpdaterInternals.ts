import { addNestKey } from '@ui-schema/ui-schema/UIStore'
import { ScopeOnChangeHandler } from '@ui-schema/ui-schema/storeUpdater'
import { updateStoreScope } from '@ui-schema/ui-schema/storeScopeUpdater'
import { storeBuildScopeTree } from '@ui-schema/ui-schema/storeBuildScopeTree'

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

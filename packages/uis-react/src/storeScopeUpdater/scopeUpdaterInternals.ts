import { addNestKey, StoreKeys, UIStoreType } from '@ui-schema/react/UIStore'
import { updateStoreScope } from '@ui-schema/react/storeScopeUpdater'
// import { storeBuildScopeTree } from '@ui-schema/react/storeBuildScopeTree2'
// import { List, Map } from 'immutable'
import { storeBuildScopeTree } from '@ui-schema/react/storeBuildScopeTree'

export const scopeUpdaterInternals = <S extends UIStoreType = UIStoreType>(
    store: S, storeKeys: StoreKeys, newValue: any,
) => {
    //if (typeof oldValue === 'undefined') {
    // initializing the tree for correct data types
    // https://github.com/ui-schema/ui-schema/issues/119
    store = storeBuildScopeTree(storeKeys, 'internals', store, 'internals', false)
    // store = storeBuildScopeTree(
    //     storeKeys, 'internals', store,
    //     (key) => typeof key === 'number' ? List() : Map(),
    //     () => Map({self: Map()}),
    // )
    //}
    return updateStoreScope(
        store, 'internals', storeKeys.size ? addNestKey('internals', storeKeys) : storeKeys,
        // store, 'internals', storeKeys.size ? addNestKey('children', storeKeys) : storeKeys,
        newValue,
    )
}

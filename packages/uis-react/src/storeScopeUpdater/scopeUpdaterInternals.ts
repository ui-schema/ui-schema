import { addNestKey, StoreKeys, UIStoreType } from '@ui-schema/react/UIStore'
import { updateStoreScope } from '@ui-schema/react/storeScopeUpdater'
import { storeBuildScopeTree } from '@ui-schema/react/storeBuildScopeTree'
import { List, Map } from 'immutable'

export const scopeUpdaterInternals = <S extends UIStoreType = UIStoreType>(
    store: S, storeKeys: StoreKeys, newValue: any,
) => {
    // initializing the tree for correct data types
    // https://github.com/ui-schema/ui-schema/issues/119
    store = storeBuildScopeTree(
        storeKeys, 'internals', store,
        (key) => typeof key === 'number' ? List() : Map(),
        () => Map({self: Map()}),
    )
    return updateStoreScope(
        store, 'internals',
        (storeKeys.size ? addNestKey('children', storeKeys) : Array.isArray(storeKeys) ? List(storeKeys) : storeKeys).push('self'),
        newValue,
    )
}

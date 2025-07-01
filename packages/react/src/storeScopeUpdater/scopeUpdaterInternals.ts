import { addNestKey, StoreKeys, UIStoreType } from '@ui-schema/react/UIStore'
import { updateStoreScope } from '@ui-schema/react/storeScopeUpdater'
import { storeBuildScopeTree } from '@ui-schema/react/storeBuildScopeTree'
import { List, Map } from 'immutable'

export const scopeUpdaterInternals = <S extends UIStoreType = UIStoreType>(
    store: S, storeKeys: StoreKeys, newValue: any,
    op: 'set' | 'delete',
) => {
    const storeBuild = storeBuildScopeTree(
        storeKeys, 'internals', store,
        op === 'set' ? (key) => typeof key === 'number' ? List() : Map() : undefined,
        () => Map({self: Map()}),
    )

    if (storeBuild.incomplete) {
        return store
    }

    return updateStoreScope(
        storeBuild.store, 'internals',
        (storeKeys.size ? addNestKey('children', storeKeys) : Array.isArray(storeKeys) ? List(storeKeys) : storeKeys).push('self'),
        newValue,
    )
}

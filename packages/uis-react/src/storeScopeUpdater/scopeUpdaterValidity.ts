import { storeBuildScopeTree } from '@ui-schema/react/storeBuildScopeTree'
import { addNestKey, prependKey, StoreKeys, UIStoreType } from '@ui-schema/react/UIStore'
import { updateStoreScope } from '@ui-schema/react/storeScopeUpdater'
import { List, Map } from 'immutable'

export const scopeUpdaterValidity = <S extends UIStoreType = UIStoreType>(
    store: S, storeKeys: StoreKeys, newValue: any,
) => {
    store = storeBuildScopeTree(
        storeKeys, 'validity', store,
        (key) => typeof key === 'number' ? List() : Map(),
        () => Map({}),
    )
    if (typeof newValue === 'undefined') {
        store = store.deleteIn(
            // todo: add the `valid` sub key as the one for mutation? support `newValue` being any object (except `children`)?
            prependKey(storeKeys.size ? addNestKey('children', storeKeys) : Array.isArray(storeKeys) ? List(storeKeys) : storeKeys, 'validity').push('valid'),
        ) as typeof store
    } else {
        if (!store.validity) {
            store = store.set('validity', Map()) as S
        }
        store = updateStoreScope(
            store, 'validity',
            // todo: add the `valid` sub key as the one for mutation? support `newValue` being any object (except `children`)?
            (storeKeys.size ? addNestKey('children', storeKeys) : Array.isArray(storeKeys) ? List(storeKeys) : storeKeys).push('valid'),
            newValue,
        )
    }
    return store
}

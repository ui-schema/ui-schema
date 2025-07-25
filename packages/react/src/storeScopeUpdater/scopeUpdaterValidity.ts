import { storeBuildScopeTree } from '@ui-schema/react/storeBuildScopeTree'
import { addNestKey, prependKey, StoreKeys, UIStoreType } from '@ui-schema/react/UIStore'
import { updateStoreScope } from '@ui-schema/react/storeScopeUpdater'
import { List, Map } from 'immutable'

export const scopeUpdaterValidity = <S extends UIStoreType = UIStoreType>(
    store: S, storeKeys: StoreKeys, newValue: any,
    op: 'set' | 'delete',
) => {
    // todo: switch fully to `op` once `valid` etc. isn't included here
    store = storeBuildScopeTree(
        storeKeys, 'validity', store,
        op === 'set' || typeof newValue === 'undefined' ? (key) => typeof key === 'number' ? List() : Map() : undefined,
        () => Map({}),
    ).store
    if (op === 'delete' || typeof newValue === 'undefined') {
        store = store.deleteIn(
            // todo: add the `valid` sub key as the one for mutation? support `newValue` being any object (except `children`)?
            // todo: deleting whole node, instead of just `.valid`, would destroy to much information, but there should be a way to "delete all" and "delete all except `children`"
            prependKey(storeKeys.size ? addNestKey('children', storeKeys) : Array.isArray(storeKeys) ? List(storeKeys) : storeKeys, 'validity').push('valid'),
        ) as S
        store = store.deleteIn(
            prependKey(storeKeys.size ? addNestKey('children', storeKeys) : Array.isArray(storeKeys) ? List(storeKeys) : storeKeys, 'validity').push('errors'),
        ) as S
    } else {
        if (!store.validity) {
            store = store.set('validity', Map()) as S
        }
        const valid =
            typeof newValue === 'boolean'
                ? newValue
                : Map.isMap(newValue) ? newValue.get('valid') : typeof newValue === 'object' && newValue && typeof newValue.valid === 'boolean' && newValue.valid
        const errors = Map.isMap(newValue) ? newValue.get('errors') : typeof newValue === 'object' && newValue ? newValue.errors : undefined
        store = updateStoreScope(
            store, 'validity',
            // todo: add the `valid` sub key as the one for mutation? support `newValue` being any object (except `children`)?
            (storeKeys.size ? addNestKey('children', storeKeys) : Array.isArray(storeKeys) ? List(storeKeys) : storeKeys).push('valid'),
            Boolean(valid),
        )
        store = updateStoreScope(
            store, 'validity',
            (storeKeys.size ? addNestKey('children', storeKeys) : Array.isArray(storeKeys) ? List(storeKeys) : storeKeys).push('errors'),
            errors || null,
        )
    }
    return store
}

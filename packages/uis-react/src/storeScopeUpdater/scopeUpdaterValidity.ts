import { prependKey, StoreKeys, UIStoreType } from '@ui-schema/react/UIStore'
import { List } from 'immutable'
import { updateStoreScope } from '@ui-schema/react/storeScopeUpdater'

export const scopeUpdaterValidity = <S extends UIStoreType = UIStoreType>(
    store: S, storeKeys: StoreKeys, newValue: any,
) => {
    if (storeKeys.contains('__valid')) {
        throw new Error('forbidden property name `__valid` is used, not compatible with UIStore')
    }
    storeKeys = storeKeys.map(k => k?.toString()) as List<string>
    if (typeof newValue === 'undefined') {
        store = store.deleteIn(prependKey(storeKeys.push('__valid'), 'validity')) as typeof store
        // store = store.deleteIn(prependKey(storeKeys.size ? addNestKey('children', storeKeys) : storeKeys, 'validity')) as typeof store
    } else {
        store = updateStoreScope(
            store, 'validity',
            storeKeys.push('__valid'),
            // todo: add the `valid` sub key as the one for mutation? support `newValue` being any object (except `children`)?
            // storeKeys.size ? addNestKey('children', storeKeys) : storeKeys,
            newValue,
        )
    }
    return store
}

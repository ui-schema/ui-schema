import { prependKey } from '@ui-schema/ui-schema/UIStore'
import { List } from 'immutable'
import { ScopeOnChangeHandler } from '@ui-schema/ui-schema/storeUpdater'
import { updateStoreScope } from '@ui-schema/ui-schema/storeScopeUpdater'

export const scopeUpdaterValidity: ScopeOnChangeHandler = (store, storeKeys, newValue) => {
    if (storeKeys.contains('__valid')) {
        throw new Error('forbidden property name `__valid` is used, not compatible with UIStore')
    }
    storeKeys = storeKeys.map(k => k?.toString()) as List<string>
    if (typeof newValue === 'undefined') {
        store = store.deleteIn(prependKey(storeKeys.push('__valid'), 'validity'))
    } else {
        store = updateStoreScope(
            store, 'validity', storeKeys.push('__valid'),
            newValue
        )
    }
    return store
}

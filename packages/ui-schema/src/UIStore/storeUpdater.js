import {prependKey, shouldDeleteOnEmpty} from '@ui-schema/ui-schema/UIStore/UIStore';
import {List, Map} from 'immutable';

const updateStoreScope = (store, scope, storeKeys, oldValue, newValue, deleteOnEmpty, type) => {
    if(shouldDeleteOnEmpty(newValue, deleteOnEmpty, type)) {
        const parentStore = store.getIn(storeKeys.size ? prependKey(storeKeys.splice(storeKeys.size - 1, 1), scope) : [scope])
        // e.g. numbers in tuples must only be deleted, when it is inside an object, when inside an `list` undefined must be used for a "reset"
        if(List.isList(parentStore)) {
            store = store.setIn(storeKeys.size ? prependKey(storeKeys, scope) : [scope], undefined);
        } else if(Map.isMap(parentStore)) {
            store = store.deleteIn(storeKeys.size ? prependKey(storeKeys, scope) : [scope]);
        }
        return store
    }

    store = store.setIn(
        storeKeys.size ? prependKey(storeKeys, scope) : [scope],
        newValue,
    )
    return store
}

const getScopedValue = (storeKeys, scope, store) => store.getIn(storeKeys.size ? prependKey(storeKeys, scope) : [scope])

export const storeUpdater = (storeKeys, scopes, updater, deleteOnEmpty, type) =>
    store => {
        const doValue = scopes.indexOf('value') !== -1
        const doInternal = scopes.indexOf('internal') !== -1
        const doValidity = scopes.indexOf('valid') !== -1
        const values = {}
        if(doValue) {
            values.value = getScopedValue(storeKeys, 'values', store)
        }
        if(doInternal) {
            values.internal = getScopedValue(storeKeys, 'internals', store)
        }
        if(doValidity) {
            values.valid = getScopedValue(storeKeys, 'validity', store)
        }
        const res = updater({...values})
        if(doValue) {
            store = updateStoreScope(
                store, 'values', storeKeys,
                values.value, res.value,
                deleteOnEmpty, type,
            )
        }
        if(doInternal) {
            store = updateStoreScope(
                store, 'internals', storeKeys,
                values.internal, res.internal,
                deleteOnEmpty, type,
            )
        }
        if(doValidity) {
            if(typeof res.valid === 'undefined') {
                store = store.deleteIn(prependKey(storeKeys.push('__valid'), 'validity'))
            } else {
                store = updateStoreScope(
                    store, 'validity', storeKeys.push('__valid'),
                    values.valid, res.valid,
                    deleteOnEmpty, type,
                )
            }
        }

        return store
    }

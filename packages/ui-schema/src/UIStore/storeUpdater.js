import {prependKey, shouldDeleteOnEmpty} from '@ui-schema/ui-schema/UIStore/UIStore';
import {List} from 'immutable';
import React from 'react';

const updateStoreScope = (store, scope, storeKeys, updater, deleteOnEmpty, type) => {
    let deleteValue = false
    store = store.updateIn(
        storeKeys.size ? prependKey(storeKeys, scope) : scope,
        oldValue => {
            oldValue = updater(oldValue)
            if(shouldDeleteOnEmpty(oldValue, deleteOnEmpty, type)) {
                deleteValue = true
            }
            return oldValue
        },
    )
    if(deleteValue) {
        store = store.deleteIn(storeKeys.size ? prependKey(storeKeys, scope) : [scope]);
    }
    return store
}

export const storeUpdater = (storeKeys, values, deleteOnEmpty, type) =>
    store => {
        const {value, valid, internalValue, _deprecated_compat} = values

        if(value) {
            store = updateStoreScope(store, 'values', storeKeys, value, deleteOnEmpty, type)
        }
        if(internalValue) {
            store = updateStoreScope(store, 'internals', storeKeys, internalValue, deleteOnEmpty, type)
        }
        if(valid) {
            store = updateStoreScope(store, 'validity', storeKeys.push('__valid'), valid, false)
        }
        // will be removed in 0.2.0
        if(_deprecated_compat) {
            store = _deprecated_compat(store)
        }

        return store
    }
/**
 * @deprecated will be removed in 0.2.0
 * @param onChangeNext
 * @return {function(*): void}
 */
export const onChangeCompat = onChangeNext => React.useCallback((handler) => {
    onChangeNext(List([]), {_deprecated_compat: (store) => handler(store)})
}, [onChangeNext])

/**
 * @deprecated will be removed in 0.2.0
 * @param onChange
 * @return {function(...[*]): void}
 */
export const onChangeNextCompat = onChange => React.useCallback((...args) => {
    onChange(storeUpdater(...args))
}, [onChange])

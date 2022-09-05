import {
    prependKey, shouldDeleteOnEmpty, StoreKeys, UIStoreType,
} from '@ui-schema/react/UIStore'
import { List, Map, Record } from 'immutable'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'
import { updateStoreScope } from '@ui-schema/react/storeScopeUpdater'
import { storeBuildScopeTree } from '@ui-schema/react/storeBuildScopeTree'

export const scopeUpdaterValues = <S extends UIStoreType = UIStoreType, A extends UIStoreActions = UIStoreActions>(
    store: S, storeKeys: StoreKeys, newValue: any, action: A,
): S => {
    //if (typeof oldValue === 'undefined') {
    // initializing the tree for correct data types
    // https://github.com/ui-schema/ui-schema/issues/119
    store = storeBuildScopeTree(storeKeys, 'values', store, undefined, true)
    //}
    // todo: the decision for `should delete` should only come from "value", and then used by e.g. internalValue/validity updates,
    //       but also some internal values must be preserved, like `is default handled`, `richtext editor state`
    // todo: also, actually, it must be checked & deleted recursively
    if (shouldDeleteOnEmpty(newValue, action?.schema?.get('deleteOnEmpty') as boolean || action?.required, action?.schema?.get('type') as SchemaTypesType)) {
        if (storeKeys.size) {
            // @ts-ignore
            const parentStore = store.getIn(prependKey(storeKeys.splice(storeKeys.size - 1, 1) as StoreKeys, 'values'))
            // e.g. numbers in tuples must only be deleted, when it is inside an object, when inside an `list` undefined must be used for a "reset"
            // todo: support valueOnDelete and fix behaviour in Array tuples https://github.com/ui-schema/ui-schema/issues/106
            //       also tests are missing atm.
            if (List.isList(parentStore)) {
                // @ts-ignore
                store = store.setIn(prependKey(storeKeys, 'values'), null)
            } else if (Map.isMap(parentStore) || Record.isRecord(parentStore)) {
                // @ts-ignore
                store = store.deleteIn(prependKey(storeKeys, 'values'))
            }
        } else {
            store = store.deleteIn(['values'])
        }
        return store
    }

    // todo: when parent is a `list`, check if "all other array items exist" - and when not, fill them with e.g. `null`

    return updateStoreScope(
        store, 'values', storeKeys,
        newValue
    )
}

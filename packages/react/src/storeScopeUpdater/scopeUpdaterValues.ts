import {
    prependKey, StoreKeys, UIStoreType,
} from '@ui-schema/react/UIStore'
import { List, Map, OrderedMap, Record } from 'immutable'
import { updateStoreScope } from '@ui-schema/react/storeScopeUpdater'
import { storeBuildScopeTree } from '@ui-schema/react/storeBuildScopeTree'

export const scopeUpdaterValues = <S extends UIStoreType = UIStoreType>(
    store: S, storeKeys: StoreKeys, newValue: any,
    op: 'set' | 'delete',
): S => {
    // initializing the tree for correct data types
    // https://github.com/ui-schema/ui-schema/issues/119
    // todo: deleting must not initialize tree
    const storeBuild = storeBuildScopeTree(
        storeKeys, 'values', store,
        op === 'set' ? (key) => typeof key === 'number' ? List() : OrderedMap() : undefined,
    )

    if (op === 'delete') {
        if (storeBuild.incomplete) {
            return store
        }
        store = storeBuild.store
        if (storeKeys.size) {
            const parentStore = store.getIn(prependKey(storeKeys.slice(0, -1) as StoreKeys, 'values'))
            // e.g. numbers in tuples must only be deleted, when it is inside an object, when inside an `list` undefined must be used for a "reset"
            // todo: support valueOnDelete and fix behaviour in Array tuples https://github.com/ui-schema/ui-schema/issues/106
            //       also tests are missing atm.
            if (List.isList(parentStore)) {
                // todo: even with `op` delete, this is not a delete for array items, where list-item-delete uses changes the parent instead
                store = store.setIn(prependKey(storeKeys, 'values'), null) as typeof store
            } else if (Map.isMap(parentStore) || Record.isRecord(parentStore)) {
                store = store.deleteIn(prependKey(storeKeys, 'values')) as typeof store
            }
        } else {
            store = store.deleteIn(['values']) as typeof store
        }
        return store
    }

    // todo: when parent is a `list`, check if "all other array items exist" - and when not, fill them with e.g. `null`

    return updateStoreScope(
        storeBuild.store, 'values', storeKeys,
        newValue,
    )
}

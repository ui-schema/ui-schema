import { addNestKey, prependKey, StoreKeys, UIStoreType } from '@ui-schema/react/UIStore'
import { updateStoreScope } from '@ui-schema/react/storeScopeUpdater'
import { storeBuildScopeTree } from '@ui-schema/react/storeBuildScopeTree'
import { List, Map } from 'immutable'

/**
 * @todo handle `delete` or keep just for "don't initialize"?
 */
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

/**
 * A new updater util, which expects an updater function instead of values and works on the whole node and not just `.self`.
 */
export const scopeUpdaterInternals2 = <S extends UIStoreType = UIStoreType>(
    store: S, storeKeys: StoreKeys,
    op: 'set' | 'delete',
    updater: (value: Map<any, any> | null | undefined) => any,
) => {
    const storeBuild = storeBuildScopeTree(
        storeKeys, 'internals', store,
        op === 'set' ? (key) => typeof key === 'number' ? List() : Map() : undefined,
        () => Map({self: Map()}),
    )

    if (storeBuild.incomplete) {
        return store
    }

    return storeBuild.store.updateIn(
        storeKeys.size ?
            prependKey(
                (storeKeys.size ? addNestKey('children', storeKeys) : Array.isArray(storeKeys) ? List(storeKeys) : storeKeys),//.push('self'),
                'internals',
            ) :
            ['internals'],
        // @ts-ignore
        updater,
    ) as typeof store
}

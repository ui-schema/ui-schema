import { StoreKeys, UIStoreType, UIStoreStateData } from '@ui-schema/react/UIStore'
import { Map, OrderedMap } from 'immutable'
import { buildScopeTree } from './buildScopeTree.js'
import { buildTree } from './buildTree.js'

export const storeBuildScopeTree = <S extends UIStoreType>(
    storeKeys: StoreKeys,
    scope: keyof UIStoreStateData,
    store: S,
    onMiss: undefined | ((key: string | number) => any),
    onMissWrapper?: () => Map<unknown, unknown> | OrderedMap<unknown, unknown>,
): { store: S, incomplete: boolean } => {
    let root = store.get(scope)

    if (!root && onMissWrapper) {
        // init root here, as `buildScopeTree` only builds the next level and not the "last one"
        root = onMissWrapper()
    }

    const nextScopeRoot = onMissWrapper
        ? buildScopeTree(storeKeys, root, onMiss, onMissWrapper)
        : buildTree(storeKeys, root, onMiss)

    if (nextScopeRoot.incomplete) {
        return {store, incomplete: true}
    }

    store = store.set(
        scope,
        nextScopeRoot.root,
    ) as S

    return {store, incomplete: false}
}

import { List, Map, OrderedMap, Record } from 'immutable'
import { StoreKeys, UIStoreType, addNestKey, UIStoreStateData } from '@ui-schema/react/UIStore'

export const storeBuildScopeTree = <S extends UIStoreType>(storeKeys: StoreKeys, scope: keyof UIStoreStateData, store: S, nestKey: string | undefined = undefined, ordered: boolean = false): S => {
    const relativeList: (string | number)[] = [scope]
    if (nestKey) {
        storeKeys = addNestKey(nestKey, storeKeys)
    }
    storeKeys.forEach(key => {
        if (typeof key === 'undefined') return

        const value = store.getIn(relativeList)
        if (
            (
                !List.isList(value) &&
                !Map.isMap(value) &&
                !Record.isRecord(value)
            ) ||
            (typeof key === 'number' && !List.isList(value))
        ) {
            store = store.setIn(
                relativeList,
                typeof key === 'number' ? List() : ordered ? OrderedMap() : Map()
            ) as S
        }

        // the current iteration must have the "parents" relative storeKeys, not it's own,
        // thus doesn't do the last entry inside the tree, that one must be handled by the widget/onChange handler
        relativeList.push(key)
    })
    return store
}

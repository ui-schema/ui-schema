import { StoreKeys } from '@ui-schema/react/UIStore'
import { List, Map, OrderedMap } from 'immutable'

export const buildTree = <TRoot extends List<unknown> | Map<unknown, unknown> | OrderedMap<unknown, unknown> | undefined>(
    storeKeys: StoreKeys,
    root: TRoot,
    // is called if the parent of the next key does not exist
    onMiss: (key: string | number) => any,
): TRoot => {
    let current: any = root
    const path: (string | number)[] = []

    storeKeys.forEach((key) => {
        // todo: if nestKey and the root doesn't have the nestKey (but maybe other data)
        //       it will go onMiss and as `nestKey` isn't in path, it may overwrite the root fully
        //       - don't overwrite if nestKey doesn't exist
        //       - only add nestKey level
        //       - add nestKey in needed in type: List or Map for internals
        if (typeof key === 'number') {
            if (
                !current
                || !List.isList(current)
            ) {
                current = onMiss(key)
                root = root ? root.setIn(path, current) : current
            }
        } else if (
            !current
            || !Map.isMap(current)
        ) {
            current = onMiss(key)
            root = root ? root.setIn(path, current) : current
        }

        path.push(key)
        current = current.get(key)
    })

    return root
}

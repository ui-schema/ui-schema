import { StoreKeys } from '@ui-schema/react/UIStore'
import { List, Map, OrderedMap } from 'immutable'

export const buildTree = <TRoot extends List<unknown> | Map<unknown, unknown> | OrderedMap<unknown, unknown> | undefined>(
    storeKeys: StoreKeys,
    root: TRoot,
    // is called if the parent of the next key does not exist
    onMiss: undefined | ((key: string | number) => any),
): { root: TRoot, incomplete: boolean } => {
    let current: any = root
    const path: (string | number)[] = []
    let incomplete: boolean = false

    for (const key of storeKeys) {
        if (typeof key === 'number') {
            if (
                !current
                || !List.isList(current)
            ) {
                if (!onMiss) {
                    incomplete = true
                    break
                }
                current = onMiss(key)
                root = root ? root.setIn(path, current) : current
            }
        } else if (
            !current
            || !Map.isMap(current)
        ) {
            if (!onMiss) {
                incomplete = true
                break
            }
            current = onMiss(key)
            root = root ? root.setIn(path, current) : current
        }

        path.push(key)
        current = current.get(key)
    }

    return {root, incomplete}
}

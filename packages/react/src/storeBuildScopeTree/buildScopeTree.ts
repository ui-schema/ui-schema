import { StoreKeys } from '@ui-schema/react/UIStore'
import { List, Map, OrderedMap } from 'immutable'

export const buildScopeTree = <TRoot extends List<unknown> | Map<unknown, unknown> | OrderedMap<unknown, unknown>>(
    storeKeys: StoreKeys,
    root: TRoot | undefined,
    // is called if the parent of the next key does not exist
    onMiss: undefined | ((key: string | number) => any),
    // is called if the level which holds the value and the further nesting
    onMissWrapper: () => Map<unknown, unknown> | OrderedMap<unknown, unknown>,
): { root: TRoot | undefined, incomplete: boolean } => {
    let current: any = root
    const path: (string | number)[] = []
    let incomplete: boolean = false

    for (const key of storeKeys) {
        if (!current) {
            current = onMissWrapper()
            root = root ? root.setIn(path, current) : current
        }
        path.push('children')
        current = current.get('children')
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
                root = (root as TRoot).setIn(path, current) as TRoot
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
            root = (root as TRoot).setIn(path, current) as TRoot
        }

        path.push(key)
        current = current.get(key)
    }

    return {root, incomplete}
}

import { List, Map } from 'immutable'
import { StoreKeys } from '@ui-schema/react/UIStore'

const searchRecursive = (
    immutable: Map<string, any>,
    count: boolean,
) => {
    if (!immutable) return 0

    let found = 0

    let further: any[] = [immutable]
    while (further.length) {
        const value = further.pop()!
        if (!value) continue
        if (value.get('valid') === false) {
            found++
            if (!count) {
                break
            }
        }
        const children = value.get('children')
        if (Map.isMap(children) || List.isList(children)) {
            further = further.concat(Array.from(children.values()))
        }
    }

    return found
}

/**
 * Checks if the `scope` is valid,
 * returns:
 * - `0` when no error was found
 * - `1` when error was found and `count` = false
 * - `1+` when error was found and `count` = true
 */
export const isInvalid = (
    validity: Map<any, any> | undefined,
    storeKeys: StoreKeys = List([]),
    count: boolean = false,
) => {
    return searchRecursive(validity?.getIn(storeKeys) as Map<any, undefined>, count)
}

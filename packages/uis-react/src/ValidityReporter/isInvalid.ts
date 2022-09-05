import { List, Map } from 'immutable'
import { StoreKeys } from '@ui-schema/react/UIStore'

const searchRecursive = (immutable: Map<string, any>, val: any, keys: StoreKeys, count = false) => {
    if (!immutable || immutable.size === 0) return 0

    let found = 0

    const further: any[] = []
    for (const [, value] of immutable) {
        if (Map.isMap(value)) {
            if (keys) {
                const t = value.getIn(keys)
                if (typeof t !== 'undefined' || typeof val === 'undefined') {
                    if (t === val) {
                        found++
                        if (!count) {
                            break
                        }
                    }
                }
                further.push(value.deleteIn(keys))
            } else {
                further.push(value)
            }
        } else if (value === val) {
            found++

            if (!count) {
                break
            }
        }
    }

    if (further.length && (!found || (found && count))) {
        for (const value of further) {
            found += searchRecursive(value, val, keys, count)

            if (found && !count) {
                break
            }
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
    validity?: Map<any, undefined>,
    scope: StoreKeys = List([]),
    count: boolean = false,
) => {
    if (!validity) return 0

    return searchRecursive(validity.getIn(scope) as Map<any, undefined>, false, List(['__valid']), count)
}

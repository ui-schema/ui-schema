import type { Validity } from '@ui-schema/react/UIStore'
import { List, Map } from 'immutable'

const searchRecursive = (
    immutable: Map<string, unknown> | Validity | undefined,
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
    validity: Map<any, unknown> | Validity | undefined,
    count: boolean = false,
) => {
    return searchRecursive(validity, count)
}

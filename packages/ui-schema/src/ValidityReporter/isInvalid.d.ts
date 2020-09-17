import { Map } from 'immutable'
import { StoreKeys } from "@ui-schema/ui-schema/UIStore"

/**
 * Checks if the `scope` is valid,
 * returns:
 * - `0` when no error was found
 * - `1` when error was found and `count` = false
 * - `1+` when error was found and `count` = true
 */
export function isInvalid(
    validity: Map<any, undefined>,
    scope?: StoreKeys,
    count?: boolean
): number

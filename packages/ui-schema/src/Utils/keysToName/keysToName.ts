import { List } from 'immutable'

/**
 * Generates query-string compatible names from storeKeys.
 *
 * URL-encodes keys to prevent invalid HTML or broken selectors, e.g. due to `[`/`|` in names.
 */
export function keysToName(
    keys: List<unknown> | unknown[],
    rootName = '__root',
) {
    if (Array.isArray(keys) ? !keys.length : !keys.size) return rootName

    let name: string = ''

    for (const k of keys) {
        const encoded = typeof k === 'string' ? encodeURIComponent(k) : String(k)
        if (name) {
            name += `[${encoded}]`
        } else {
            name += encoded
        }
    }

    return name
}

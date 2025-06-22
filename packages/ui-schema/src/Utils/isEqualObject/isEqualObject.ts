import { isEqual as isEqualValue } from '@ui-schema/ui-schema/Utils/isEqual'

/**
 * Compares the two objects, including the order of their properties.
 */
export const isEqualObject = (a: Object, b: Object): boolean => {
    const prevKeys = Object.keys(a)
    const nextKeys = Object.keys(b)
    if (
        prevKeys.length !== nextKeys.length ||
        !prevKeys.every(v => nextKeys.includes(v))
    ) {
        return false
    }

    for (const next in b) {
        if (!isEqualValue(a[next], b[next])) {
            return false
        }
    }

    return true
}

import { isEqual } from '@ui-schema/ui-schema/Utils/isEqual'
import { isEqualObjectContents } from '@ui-schema/ui-schema/Utils/isEqualObjectContents'
import * as React from 'react'

/**
 * Memoize the factory output depending on changes of the dependencyObject.
 *
 * Does not compare order of properties in the root level of the dependencyObject.
 *
 * Uses immutable compatible equality check on each property.
 */
export const useMemoWithObject = <R = unknown>(
    factory: () => R,
    dependencyObject: Record<string, unknown>,
) => {
    const obj = React.useRef<{
        last: Record<string, unknown> | undefined
        memoized: R
    }>({
        last: undefined,
        memoized: undefined as R,
    })

    if (!obj.current.last || !isEqualObjectContents(obj.current.last, dependencyObject, isEqual)) {
        obj.current.last = dependencyObject
        obj.current.memoized = factory()
    }

    return obj.current.memoized
}

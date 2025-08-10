import { isEqual } from '@ui-schema/ui-schema/Utils/isEqual'
import * as React from 'react'
import { List, Map, OrderedMap } from 'immutable'

/*
 * If the value passed in is structurally equal to the one saved in the ref,
 * it will return the one saved in the ref to preserve reference equality
 */
export function useImmutable<T = List<any> | Map<any, any> | OrderedMap<any, any> | unknown>(value: T): T {
    const currentState = React.useRef(value)
    if (!isEqual(currentState.current, value)) {
        // update the referenced immutable when:
        // - value is not a immutable (Map/List) AND is not a Record (as `isImmutable` doesn't check for records)
        // - the current state doesn't equal the next value - what must only be done when not an immutable data type
        currentState.current = value
    }
    return currentState.current
}

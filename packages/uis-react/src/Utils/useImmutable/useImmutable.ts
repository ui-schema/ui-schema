import React from 'react'
import { isImmutable, List, Map, Record } from 'immutable'

/*
 * If the value passed in is structurally equal to the one saved in the ref,
 * it will return the one saved in the ref to preserve reference equality
 */
export function useImmutable<T = List<any> | Map<any, any> | any>(value: T): T {
    const currentState = React.useRef(value)
    if (
        (!isImmutable(currentState.current) && !Record.isRecord(value)) ||
        // @ts-ignore
        !currentState.current?.equals(value)
    ) {
        // update the referenced immutable when:
        // - value is not a immutable (Map/List) AND is not a Record (as `isImmutable` doesn't check for records)
        // - the current state doesn't equal the next value - what must only be done when not an immutable data type
        currentState.current = value
    }
    return currentState.current
}

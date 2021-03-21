import React from 'react'
import {isImmutable} from 'immutable'

/*
 * If the value passed in is structurally equal to the one saved in the ref,
 * it will return the one saved in the ref to preserve reference equality
 */
export function useImmutable(value) {
    const currentState = React.useRef(value)
    if(
        !isImmutable(currentState.current) ||
        !currentState.current?.equals(value)
    ) {
        currentState.current = value
    }
    return currentState.current
}

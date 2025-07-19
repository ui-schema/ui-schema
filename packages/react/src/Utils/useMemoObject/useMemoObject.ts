import { isEqual } from '@ui-schema/ui-schema/Utils/isEqual'
import { isEqualObjectContents } from '@ui-schema/ui-schema/Utils/isEqualObjectContents'
import * as React from 'react'

/**
 * Memo on a single object, returned object will only change if any of the properties are not equal (===).
 *
 * Does not compare order of properties.
 */
export function useMemoObject<O extends object>(currentObject: O) {
    const obj = React.useRef(currentObject)

    if (!isEqualObjectContents(obj.current, currentObject, isEqual)) {
        obj.current = currentObject
    }

    return obj.current
}

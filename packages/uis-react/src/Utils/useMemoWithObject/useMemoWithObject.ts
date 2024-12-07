import { isEqual } from '@ui-schema/system/Utils/isEqual'
import { useRef } from 'react'

export const useMemoWithObject = <R = unknown>(
    factory: () => R,
    dependencyObject: Record<string, unknown>,
) => {
    const obj = useRef<R>(undefined as R)

    if (Object.keys(dependencyObject).some(k => !isEqual(dependencyObject[k], obj[k]))) {
        obj.current = factory()
    }

    return obj.current
}

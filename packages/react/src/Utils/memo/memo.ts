import React from 'react'
import { getDisplayName } from './getDisplayName.js'
import { isEqualObject } from '@ui-schema/ui-schema/Utils/isEqualObject'

/**
 * Immutable compatible `React.memo` comparison
 */
export const memo = <C extends React.ComponentType<any> = React.ComponentType<any>>(Component: C): C => {
    const Memoized = React.memo(Component, isEqualObject)
    Memoized.displayName = getDisplayName(Component)
    return Memoized as unknown as C
}

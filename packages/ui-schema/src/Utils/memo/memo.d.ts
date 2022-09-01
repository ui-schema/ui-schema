import React from 'react'

/**
 * @deprecated use `Utils/isEqualObject` instead
 */
export function isEqual(prevProps: {}, nextProps: {}): boolean

export function memo<C = React.ComponentType<any>>(Component: C): C

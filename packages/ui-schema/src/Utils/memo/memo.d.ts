import React from 'react'

export function isEqual(prevProps: {}, nextProps: {}): boolean

export function memo<C = React.ComponentType<any>>(Component: C): C

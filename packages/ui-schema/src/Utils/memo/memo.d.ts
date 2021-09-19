import React from 'react'

export function isEqual(prevProps: {}, nextProps: {}): boolean

//export function memo<P extends {}>(Component: React.ComponentType<P>): React.ComponentType<P>
export function memo<C = React.ComponentType<any>>(Component: C): C

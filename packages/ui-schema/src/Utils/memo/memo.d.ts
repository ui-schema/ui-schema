import React from 'react'

export function isEqual(prevProps: {}, nextProps: {}): boolean

export function memo<P>(Component: React.ComponentType<P>): React.FunctionComponent<P>

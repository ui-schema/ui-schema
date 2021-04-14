import React from 'react'

export function isEqual(prevProps: {}, nextProps: {}): boolean

export function memo<P extends {}>(Component: React.ComponentType<P>): React.ComponentType<P>

import React from 'react'

/**
 * @internal
 */
export function getDisplayName<P extends {}>(WrappedComponent: React.ComponentType<P>): string {
    return WrappedComponent.displayName || WrappedComponent.name || 'Anonymous'
}

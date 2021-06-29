import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { List } from 'immutable'
import { onErrors } from '@ui-schema/ui-schema/ValidatorErrors'

export interface PluginProps extends WidgetProps {
    // must be transformed from list to boolean `required` by a plugin
    requiredList?: List<any>
    // current number of plugin in the stack
    currentPluginIndex: number
    // contains the value for any items (scalar/objects/array)
    value: any

    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    // is executed in `WidgetRenderer`, not passed down to widget
    onErrors?: onErrors
}

export type ComponentPluginType = React.ComponentType<PluginProps>
export type PluginType = ComponentPluginType

export function PluginComponent<P extends PluginProps>(props: P): React.ReactElement<P>

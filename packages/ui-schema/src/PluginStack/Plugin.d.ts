import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { List } from 'immutable'
import { onErrors } from '@ui-schema/ui-schema/ValidatorStack'

export interface PluginProps extends WidgetProps {
    // must be transformed from list to boolean `required` by a plugin
    requiredList?: List<any>
    // current number of plugin in the stack
    current: number
    // contains the value for any items (scalar/objects/array)
    value: any

    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    // is executed in `WidgetRenderer`, not passed down to widget
    onErrors?: onErrors
}

export type PluginType = React.ComponentType<PluginProps>

export function PluginComponent<P extends PluginProps>(props: P): React.ReactElement<P>

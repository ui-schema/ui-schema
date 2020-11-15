import React from 'react'
import { WidgetProps } from "@ui-schema/ui-schema/Widget"
import { List } from "immutable"

export interface PluginProps extends WidgetProps {
    // must be transformed from list to boolean `required` by a plugin
    requiredList?: List<any>
    // current number of plugin in the stack
    current: number
    // contains the value for any items (scalar/objects/array)
    value: any
    // new prop for specifying hidden inputs / virtual lists
    isVirtual?: boolean
}

export type PluginType = React.ComponentType<PluginProps>

export function PluginComponent<P extends PluginProps>(props: P): React.ReactElement<P>

import React from 'react'
import { WidgetProps } from "@ui-schema/ui-schema/Widget"

export interface EditorPluginProps extends WidgetProps {
    // current number of plugin in the stack
    current: number
    // contains the value for any items (scalar/objects/array)
    value: any
}

export type EditorPluginType = React.ComponentType<EditorPluginProps>

export function EditorPlugin<P extends EditorPluginProps>(props: P): React.ComponentType<P>

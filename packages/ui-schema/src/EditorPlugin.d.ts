import * as React from 'react'
import { widgetsBase } from './widgetsBase'
import { WidgetRendererProps } from './WidgetRenderer'

export interface EditorPluginProps extends WidgetRendererProps {
    widgets: widgetsBase
}

export function EditorPlugin<P extends EditorPluginProps>(props: P): React.Component<P>

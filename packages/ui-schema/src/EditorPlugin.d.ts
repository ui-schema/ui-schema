import * as React from 'react'
import { OrderedMap } from 'immutable'
import { widgetsBase } from './widgetsBase'
import { WidgetRendererProps } from '@ui-schema/ui-schema/WidgetRenderer'

export interface EditorPluginProps extends WidgetRendererProps {
    widgets: widgetsBase
    /*current,
    Widget,
    pluginStack,*/
}

export function EditorPlugin<P extends EditorPluginProps>(props: P): React.Component<P>

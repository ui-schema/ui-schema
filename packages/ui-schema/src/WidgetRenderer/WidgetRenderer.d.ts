import React from 'react'
import { PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { PluginStackProps } from '@ui-schema/ui-schema/PluginStack'

export interface WidgetRendererProps extends PluginProps {
    WidgetOverride?: PluginStackProps['WidgetOverride']
    // current number of plugin in the stack, received when executed as generic widget
    // but not when used on its own
    currentPluginIndex?: number
}

export function WidgetRenderer<P extends WidgetRendererProps>(props: P): React.ReactElement<P>

import React from 'react'
import { PluginStackProps } from '@ui-schema/ui-schema/PluginStack'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export function applyPluginStack<P extends WidgetProps>(CustomWidget: React.ComponentType<P>):
    React.ComponentType<Omit<PluginStackProps, ['WidgetOverride']> &
        Omit<P, keyof WidgetProps>>

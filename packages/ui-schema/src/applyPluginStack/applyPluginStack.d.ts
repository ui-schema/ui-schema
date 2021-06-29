import React from 'react'
import { PluginStackProps } from '@ui-schema/ui-schema/PluginStack'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export type AppliedPluginStackProps<P extends {} = {}> =
    Omit<PluginStackProps, ['WidgetOverride']> &
    Omit<P, keyof WidgetProps> &
    Pick<WidgetProps, 'schema' | 'parentSchema' | 'storeKeys' | 'level'>

export type AppliedPluginStack<P extends {} = {}> = React.ComponentType<AppliedPluginStackProps<P>>

export function applyPluginStack<C extends {} = {}, P extends WidgetProps<C> = WidgetProps<C>>(CustomWidget: React.ComponentType<P>): AppliedPluginStack<P>

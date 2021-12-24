import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { List } from 'immutable'
import { onErrors } from '@ui-schema/ui-schema/ValidatorErrors'
import { WidgetsBindingFactory } from '@ui-schema/ui-schema/WidgetsBinding'

export interface PluginProps<C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory> extends WidgetProps<C, W> {
    // must be transformed from list to boolean `required` by a plugin
    requiredList?: List<any>
    // current number of plugin in the stack
    currentPluginIndex: number

    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    // is executed in `WidgetRenderer`, not passed down to widget
    onErrors?: onErrors
}

export type ComponentPluginType<C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory> = React.ComponentType<PluginProps<C, W>>
export type PluginType = ComponentPluginType

export function PluginComponent<P extends PluginProps>(props: P): React.ReactElement<P>

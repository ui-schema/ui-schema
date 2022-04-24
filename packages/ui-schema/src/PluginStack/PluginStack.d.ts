import * as React from 'react'
import { ComponentPluginType, PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { WidgetsBindingFactory } from '@ui-schema/ui-schema/WidgetsBinding'
import { WidgetOverrideType, WidgetProps } from '@ui-schema/ui-schema/Widget'
import { AppliedPluginStackProps } from '@ui-schema/ui-schema/applyPluginStack'

export type PluginStackInjectProps = 'currentPluginIndex' | 'ownKey' | 'requiredList' | 'required' | 'errors' | 'valid'

export type PluginStackProps<WP extends {} = {}, C extends {} = {}> = AppliedPluginStackProps<C, PluginProps> & {
    // level?: number

    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    // onErrors?: onErrors

    // override widgets of MetaProvider for this particular PluginStack (passed down at some use cases)
    // widgets?: WidgetsBindingBase

    // override any widget for just this PluginStack, not passed down further on
    // better use `applyPluginStack` instead! https://ui-schema.bemit.codes/docs/core-pluginstack#applypluginstack
    // todo: actually `WidgetOverride` is a WidgetRenderer prop - and also passed through the plugins, so should be in PluginProps also - but not in WidgetProps
    WidgetOverride?: WidgetOverrideType<WP, C>

    // all other props are passed down to all rendering Plugins and the final widget
    // except defined `props` removed by `WidgetRenderer`: https://ui-schema.bemit.codes/docs/core-renderer#widgetrenderer
    // [key: string]: any
}

// - `WP` = extra supported/required widget props
// - `C` = custom `meta context` or additional `config context`
export function PluginStack<WP extends {} = {}, C extends {} = {}, P extends PluginStackProps<WP, C> = PluginStackProps<WP, C>>(
    props: P & WP
): React.ReactElement

/**
 * Returns the next `Plugin` or when the plugin list is finished, the `WidgetRenderer`
 * @param next index of the next plugin to use
 * @param widgets the widgets binding, e.g. `props.widgets`
 */
export function getNextPlugin<C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory>(next: number, widgets: W): ComponentPluginType<C, W> | React.ComponentType<WidgetProps<W>>

/**
 * @internal use `getNextPlugin` instead, or when needed the `NextPluginRendererMemo` component
 */
export function NextPluginRenderer<P extends PluginProps>(props: P): React.ReactElement<P>

export function NextPluginRendererMemo<P extends PluginProps>(props: P): React.ReactElement<P>


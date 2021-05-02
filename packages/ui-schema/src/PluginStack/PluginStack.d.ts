import * as React from 'react'
import { PluginProps, PluginType } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { StoreKeys } from '@ui-schema/ui-schema/UIStore'
import { GroupRendererProps, WidgetsBindingBase } from '@ui-schema/ui-schema/WidgetsBinding'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { onErrors } from '@ui-schema/ui-schema/ValidatorStack'

export type WidgetOverrideType<P extends {}> = React.ComponentType<P & WidgetProps>

export interface PluginStackProps {
    level?: number
    schema: StoreSchemaType
    parentSchema: StoreSchemaType | undefined
    storeKeys: StoreKeys
    noGrid?: GroupRendererProps['noGrid']

    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    onErrors?: onErrors

    // override widgets of MetaProvider for this particular PluginStack (passed down at some use cases)
    widgets?: WidgetsBindingBase

    // override any widget for just this PluginStack, not passed down further on
    // better use `applyPluginStack` instead! https://ui-schema.bemit.codes/docs/core#applypluginstack
    WidgetOverride?: WidgetOverrideType

    // all other props are passed down to all rendering Plugins and the final widget
    // except defined `props` removed by `WidgetRenderer`: https://ui-schema.bemit.codes/docs/core#widgetrenderer
    [key: string]: any
}

export function PluginStack<P extends PluginStackProps>(
    props: P
): React.ReactElement

export function PluginStackBase(
    props: PluginStackProps
): React.ReactElement

export function getPlugin(current: number, pluginStack: []): PluginType | undefined

export function NextPluginRenderer<P extends PluginProps>(props: P): React.ReactElement<P>

export function NextPluginRendererMemo<P extends PluginProps>(props: P): React.ReactElement<P>


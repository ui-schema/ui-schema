import React from 'react'
import { ComponentPluginType } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetType } from '@ui-schema/ui-schema/Widget'
import { WidgetRendererProps } from '@ui-schema/ui-schema/WidgetRenderer'
import { PluginSimple } from '@ui-schema/ui-schema/PluginSimpleStack/PluginSimple'

export interface GroupRendererProps {
    level: number
    schema: StoreSchemaType
    noGrid?: boolean
    style?: {}
    className?: string
    spacing?: number
}

export interface WidgetsBindingComponents {
    ErrorFallback?: React.ComponentType<{
        error: any | null
        type?: string
        widget?: string
    }>
    // wraps the whole generator
    RootRenderer: React.ComponentType<any>
    // wraps any `object` that has no custom widget
    GroupRenderer: React.ComponentType<GroupRendererProps>
    // final widget matching and rendering
    WidgetRenderer: React.ComponentType<WidgetRendererProps>
    // widget plugin system (react components)
    pluginStack: ComponentPluginType[]
    // props plugin system (vanilla JS functions based)
    // > restructured from `validators` in `0.3.0`
    pluginSimpleStack: PluginSimple[]

    // actual validator function to use outside of render flow (in functions)
    // > added in `0.3.0`
    // validator: () => void
}

export interface WidgetsBindingWidgets<TW extends {} = {}, CW extends {} = {}> {
    // define native JSON-schema type widgets
    types: TW
    // define custom widgets
    custom: CW
}

/**
 * widget binding
 * - `C` = own `UIMetaContext` definition
 * - `TW` = own type widgets definition
 * - `CW` = own custom widgets definition
 */
export type WidgetsBindingFactory<W extends {} = {}, TW extends {} = {}, CW extends {} = {}> =
    WidgetsBindingComponents & W &
    WidgetsBindingWidgets<TW, CW>

export type WidgetsBindingLooseComponents<C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory> = {
    [key: string]: WidgetType<C, W>
}

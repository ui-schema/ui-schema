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

/**
 * Strict widget binding, without allowing any further root components
 * - `C` = custom `UIMetaContext` definition
 */
// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export interface WidgetsBindingBaseStrict<C extends {} = {}, W extends {} = {}> {
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

    // define native JSON-schema type widgets
    //types: { [key: string]: WidgetType<C, W> }
    types: { [key: string]: WidgetType<C> }
    // define custom widgets
    //custom: { [key: string]: WidgetType<C, W> }
    custom: { [key: string]: WidgetType<C> }
}

export type WidgetsBindingBase<C extends {} = {}, W extends {} = {}> = WidgetsBindingBaseStrict<C, W> & {
    // allow adding any further custom root components or further information
    [key: string]: React.ComponentType<any> | any
}

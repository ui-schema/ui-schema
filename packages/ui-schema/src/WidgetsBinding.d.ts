import React from 'react'
import { ComponentPluginType } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
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
 */
export interface WidgetsBindingBaseStrict {
    ErrorFallback?: React.ComponentType<any>
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
    types: { [key: string]: React.ComponentType<WidgetProps> }
    // define custom widgets
    custom: { [key: string]: React.ComponentType<WidgetProps> }
}

export type WidgetsBindingBase = WidgetsBindingBaseStrict & {
    // allow adding any further custom root components or further information
    [key: string]: React.ComponentType<any> | any
}

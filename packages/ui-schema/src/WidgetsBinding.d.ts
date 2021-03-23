import React from 'react'
import { PluginType } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { ValidatorPlugin } from '@ui-schema/ui-schema/ValidatorStack/ValidatorPlugin'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

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
    // widget plugin system
    pluginStack: Array<PluginType>
    // validator functions
    validators: ValidatorPlugin[]
    // define native JSON-schema type widgets
    types: { [key: string]: React.ComponentType<WidgetProps> }
    // define custom widgets
    custom: { [key: string]: React.ComponentType<WidgetProps> }
}

export type WidgetsBindingBase = WidgetsBindingBaseStrict & {
    // allow adding any further custom root components or further information
    [key: string]: React.ComponentType<any> | any
}

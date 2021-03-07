import React from 'react'
import { PluginType } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { ValidatorPlugin } from '@ui-schema/ui-schema/ValidatorStack/ValidatorPlugin'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export interface WidgetsBindingBase {
    ErrorFallback?: React.ComponentType<any>
    // wraps the whole generator
    RootRenderer: React.ComponentType<{}>
    // wraps any `object` that has no custom widget
    GroupRenderer: React.ComponentType<{ level: number, schema: StoreSchemaType }>
    // widget plugin system
    pluginStack: Array<PluginType>
    // validator functions
    validators: ValidatorPlugin[]
    // define native JSON-schema type widgets
    types: { [key: string]: React.ComponentType }
    // define custom widgets
    custom: { [key: string]: React.ComponentType }
}

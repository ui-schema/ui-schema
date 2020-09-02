import React from "react"
import { EditorPluginType } from '@ui-schema/ui-schema/EditorPlugin'
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators/ValidatorPlugin"
import { StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"

export interface WidgetsBindingBase {
    ErrorFallback: React.ComponentType<any>
    // wraps the whole editor
    RootRenderer: React.ComponentType<{}>
    // wraps any `object` that has no custom widget
    GroupRenderer: React.ComponentType<{ level: number, schema: StoreSchemaType }>
    // widget plugin system
    pluginStack: Array<EditorPluginType>
    // validator functions
    validators: ValidatorPlugin[]
    // define native JSON-schema type widgets
    types: {}
    // define custom widgets
    custom: {}
}

import React from "react"
import { EditorPluginType } from '@ui-schema/ui-schema/EditorPlugin'

export interface widgetsBase {
    ErrorFallback: React.ComponentType<any>
    // wraps the whole editor
    RootRenderer: React.ComponentType<any>
    // wraps any `object` that has no custom widget
    GroupRenderer: React.ComponentType<any>
    // widget plugin system
    pluginStack: Array<EditorPluginType>
    // validator functions
    validators: []
    // define native JSON-schema type widgets
    types: {}
    // define custom widgets
    custom: {}
}

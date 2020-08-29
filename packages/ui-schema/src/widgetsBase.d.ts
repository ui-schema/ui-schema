import React from "react"
import { EditorPluginType } from '@ui-schema/ui-schema/EditorPlugin'
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators/ValidatorPlugin"

export interface widgetsBase {
    ErrorFallback: React.ComponentType<any>
    // wraps the whole editor
    RootRenderer: React.ComponentType<any>
    // wraps any `object` that has no custom widget
    GroupRenderer: React.ComponentType<any>
    // widget plugin system
    pluginStack: Array<EditorPluginType>
    // validator functions
    validators: ValidatorPlugin[]
    // define native JSON-schema type widgets
    types: {}
    // define custom widgets
    custom: {}
}

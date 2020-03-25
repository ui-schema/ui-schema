import React from "react"

export interface widgetsBase {
    ErrorFallback: React.Component
    // wraps the whole editor
    RootRenderer: React.Component
    // wraps any `object` that has no custom widget
    GroupRenderer: React.Component
    // widget plugin system
    pluginStack: React.Component[]
    // validator functions
    validators: []
    // define native JSON-schema type widgets
    types: {}
    // define custom widgets
    custom: {}
}

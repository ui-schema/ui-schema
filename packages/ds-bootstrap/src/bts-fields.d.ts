import React from "react"

export interface widgets {
    types: {
        string: React.ComponentType
        boolean: React.ComponentType
        number: React.ComponentType
    }
    custom: {
        Text: React.ComponentType
        OptionsCheck: React.ComponentType
        OptionsRadio: React.ComponentType
        Select: React.ComponentType
        SelectMulti: React.ComponentType
    }
}

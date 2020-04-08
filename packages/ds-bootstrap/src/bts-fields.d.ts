import React from "react"

export interface widgets {
    types: {
        string: React.Component
        boolean: React.Component
        number: React.Component
    }
    custom: {
        Text: React.Component
        OptionsCheck: React.Component
        OptionsRadio: React.Component
        Select: React.Component
        SelectMulti: React.Component
    }
}

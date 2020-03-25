import React from "react"
import { widgetsBase } from "./widgetsBase"

export interface widgets extends widgetsBase {
    types: {
        string: React.Component
        boolean: React.Component
        number: React.Component
    }
    custom: {
        Text: React.Component
        StringIcon: React.Component
        TextIcon: React.Component
        NumberIcon: React.Component
        NumberSlider: React.Component
        SimpleList: React.Component
        GenericList: React.Component
        OptionsCheck: React.Component
        OptionsRadio: React.Component
        Select: React.Component
        SelectMulti: React.Component
        Stepper: React.Component
        Step: React.Component
    }
}

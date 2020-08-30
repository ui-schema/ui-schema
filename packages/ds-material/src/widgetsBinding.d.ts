import React from "react"
import { widgetsBaseInterface } from "./widgetsBase"

export const widgets: {
    types: {
        string: React.ComponentType
        boolean: React.ComponentType
        number: React.ComponentType
    }
    custom: {
        Text: React.ComponentType
        StringIcon: React.ComponentType
        TextIcon: React.ComponentType
        NumberIcon: React.ComponentType
        NumberSlider: React.ComponentType
        SimpleList: React.ComponentType
        GenericList: React.ComponentType
        OptionsCheck: React.ComponentType
        OptionsRadio: React.ComponentType
        Select: React.ComponentType
        SelectMulti: React.ComponentType
        Stepper: React.ComponentType
        Step: React.ComponentType
    }
} & widgetsBaseInterface

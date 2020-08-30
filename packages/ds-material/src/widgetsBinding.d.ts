import React from "react"
import { widgetsBaseInterface } from "./widgetsBase"
import { WidgetProps } from "@ui-schema/ui-schema/Widget"

export const widgets: {
    types: {
        string: React.ComponentType<WidgetProps>
        boolean: React.ComponentType<WidgetProps>
        number: React.ComponentType<WidgetProps>
    }
    custom: {
        Text: React.ComponentType<WidgetProps>
        StringIcon: React.ComponentType<WidgetProps>
        TextIcon: React.ComponentType<WidgetProps>
        NumberIcon: React.ComponentType<WidgetProps>
        NumberSlider: React.ComponentType<WidgetProps>
        SimpleList: React.ComponentType<WidgetProps>
        GenericList: React.ComponentType<WidgetProps>
        OptionsCheck: React.ComponentType<WidgetProps>
        OptionsRadio: React.ComponentType<WidgetProps>
        Select: React.ComponentType<WidgetProps>
        SelectMulti: React.ComponentType<WidgetProps>
        Stepper: React.ComponentType<WidgetProps>
        Step: React.ComponentType<WidgetProps>
    }
} & widgetsBaseInterface

import React from "react"
import { WidgetProps } from "@ui-schema/ui-schema/Widget"
import { WidgetsBindingBase } from "@ui-schema/ui-schema/WidgetsBinding"

export interface BtsWidgetBinding extends WidgetsBindingBase {
    types: {
        string: React.ComponentType<WidgetProps>
        boolean: React.ComponentType<WidgetProps>
        number: React.ComponentType<WidgetProps>
        integer: React.ComponentType<WidgetProps>
    }
    custom: {
        Text: React.ComponentType<WidgetProps>
        SimpleList: React.ComponentType<WidgetProps>
        OptionsCheck: React.ComponentType<WidgetProps>
        OptionsRadio: React.ComponentType<WidgetProps>
        Select: React.ComponentType<WidgetProps>
        SelectMulti: React.ComponentType<WidgetProps>
    }
}

export const widgets: BtsWidgetBinding

import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { WidgetsBindingBase } from '@ui-schema/ui-schema/WidgetsBinding'

export interface MuiWidgetBinding extends WidgetsBindingBase {
    types: {
        string: React.ComponentType<WidgetProps>
        boolean: React.ComponentType<WidgetProps>
        number: React.ComponentType<WidgetProps>
        integer: React.ComponentType<WidgetProps>
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
        Card: React.ComponentType<WidgetProps>
        LabelBox: React.ComponentType<WidgetProps>
        FormGroup: React.ComponentType<WidgetProps>
    } & {
        // allow adding any further custom widgets
        [key: string]: React.ComponentType<WidgetProps>
    }
}

export const widgets: MuiWidgetBinding

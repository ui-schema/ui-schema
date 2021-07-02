import React from 'react'
import { WidgetProps, WidgetType } from '@ui-schema/ui-schema/Widget'
import { WidgetsBindingBase } from '@ui-schema/ui-schema/WidgetsBinding'
import { WithScalarValue } from '@ui-schema/ui-schema'

export interface MuiWidgetBinding extends WidgetsBindingBase {
    types: {
        string: React.ComponentType<WidgetProps & WithScalarValue>
        boolean: React.ComponentType<WidgetProps & WithScalarValue>
        number: React.ComponentType<WidgetProps & WithScalarValue>
        integer: React.ComponentType<WidgetProps & WithScalarValue>
    }
    custom: {
        Accordions: React.ComponentType<WidgetProps>
        Text: React.ComponentType<WidgetProps & WithScalarValue>
        StringIcon: React.ComponentType<WidgetProps & WithScalarValue>
        TextIcon: React.ComponentType<WidgetProps & WithScalarValue>
        NumberIcon: React.ComponentType<WidgetProps & WithScalarValue>
        NumberSlider: React.ComponentType<WidgetProps>
        SimpleList: React.ComponentType<WidgetProps>
        GenericList: React.ComponentType<WidgetProps>
        OptionsCheck: React.ComponentType<WidgetProps>
        OptionsRadio: React.ComponentType<WidgetProps>
        Select: React.ComponentType<WidgetProps & WithScalarValue>
        SelectMulti: React.ComponentType<WidgetProps>
        Card: React.ComponentType<WidgetProps>
        LabelBox: React.ComponentType<WidgetProps>
        FormGroup: React.ComponentType<WidgetProps>
    } & {
        // allow adding any further custom widgets
        [key: string]: WidgetType
    }
}

export const widgets: MuiWidgetBinding

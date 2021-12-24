import React from 'react'
import { NumberRenderer, StringRenderer, TextRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { Select, SelectMulti } from '@ui-schema/ds-material/Widgets/Select'
import { BoolRenderer } from '@ui-schema/ds-material/Widgets/OptionsBoolean'
import { OptionsCheck } from '@ui-schema/ds-material/Widgets/OptionsCheck'
import { OptionsRadio } from '@ui-schema/ds-material/Widgets/OptionsRadio'
import { NumberIconRenderer, StringIconRenderer, TextIconRenderer } from '@ui-schema/ds-material/Widgets/TextFieldIcon'
import { SimpleList } from '@ui-schema/ds-material/Widgets/SimpleList'
import { GenericList } from '@ui-schema/ds-material/Widgets/GenericList'
import { NumberSlider } from '@ui-schema/ds-material/Widgets/NumberSlider'
import { AccordionsRenderer } from '@ui-schema/ds-material/Widgets/Accordions'
import { RootRenderer, GroupRenderer } from './Grid'
import { pluginStack } from './pluginStack'
import { WidgetRenderer } from '@ui-schema/ui-schema/WidgetRenderer'
import { validators } from '@ui-schema/ui-schema/Validators/validators'
import { CardRenderer, FormGroup, LabelBox } from '@ui-schema/ds-material/Widgets'
import { WidgetProps, WidgetsBindingFactory, WithScalarValue } from '@ui-schema/ui-schema'
import { InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'

const MyFallbackComponent: React.ComponentType<{
    error: any | null
    type?: string
    widget?: string
}> = ({type, widget}) => (
    <div>
        <p><strong>System Error in Widget!</strong></p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Widget:</strong> {widget}</p>
    </div>
)

export interface MuiWidgetsBindingTypes<C extends {} = {}, W extends MuiWidgetBinding = MuiWidgetBinding> {
    string: React.ComponentType<WidgetProps<C, W> & WithScalarValue>
    boolean: React.ComponentType<WidgetProps<C, W> & WithScalarValue>
    number: React.ComponentType<WidgetProps<C, W> & WithScalarValue>
    integer: React.ComponentType<WidgetProps<C, W> & WithScalarValue>
}

export interface MuiWidgetsBindingCustom<C extends {} = {}, W extends MuiWidgetBinding = MuiWidgetBinding> {
    Accordions: React.ComponentType<WidgetProps<C, W>>
    Text: React.ComponentType<WidgetProps<C, W> & WithScalarValue>
    StringIcon: React.ComponentType<WidgetProps<C, W> & WithScalarValue>
    TextIcon: React.ComponentType<WidgetProps<C, W> & WithScalarValue>
    NumberIcon: React.ComponentType<WidgetProps<C, W> & WithScalarValue>
    NumberSlider: React.ComponentType<WidgetProps<C, W>>
    SimpleList: React.ComponentType<WidgetProps<C, W>>
    GenericList: React.ComponentType<WidgetProps<C, W>>
    OptionsCheck: React.ComponentType<WidgetProps<C, W>>
    OptionsRadio: React.ComponentType<WidgetProps<C, W>>
    Select: React.ComponentType<WidgetProps<C, W> & WithScalarValue>
    SelectMulti: React.ComponentType<WidgetProps<C, W>>
    Card: React.ComponentType<WidgetProps<C, W>>
    LabelBox: React.ComponentType<WidgetProps<C, W>>
    FormGroup: React.ComponentType<WidgetProps<C, W>>
}

export interface MuiWidgetBindingExtra {
    InfoRenderer?: React.ComponentType<InfoRendererProps>
}

export type MuiWidgetBinding<C extends {} = {}> = WidgetsBindingFactory<MuiWidgetBindingExtra, MuiWidgetsBindingTypes<C>, MuiWidgetsBindingCustom<C>>

export const widgets: MuiWidgetBinding = {
    ErrorFallback: MyFallbackComponent,
    RootRenderer,
    GroupRenderer,
    WidgetRenderer,
    pluginStack,
    pluginSimpleStack: validators,
    types: {
        string: StringRenderer,
        boolean: BoolRenderer,
        number: NumberRenderer,
        integer: NumberRenderer,
    },
    custom: {
        Accordions: AccordionsRenderer,
        Text: TextRenderer,
        StringIcon: StringIconRenderer,
        TextIcon: TextIconRenderer,
        NumberIcon: NumberIconRenderer,
        NumberSlider,
        SimpleList,
        GenericList,
        OptionsCheck,
        OptionsRadio,
        Select,
        SelectMulti,
        Card: CardRenderer,
        LabelBox,
        FormGroup,
    },
}

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
import { WidgetProps, WidgetsBindingBase, WidgetType, WithScalarValue } from '@ui-schema/ui-schema'

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

export interface MuiWidgetBinding<C extends {} = {}, W extends {} = {}> extends WidgetsBindingBase<C, W> {
    types: {
        string: React.ComponentType<WidgetProps<C> & WithScalarValue>
        boolean: React.ComponentType<WidgetProps<C> & WithScalarValue>
        number: React.ComponentType<WidgetProps<C> & WithScalarValue>
        integer: React.ComponentType<WidgetProps<C> & WithScalarValue>
    }
    custom: {
        Accordions: React.ComponentType<WidgetProps<C>>
        Text: React.ComponentType<WidgetProps<C> & WithScalarValue>
        StringIcon: React.ComponentType<WidgetProps<C> & WithScalarValue>
        TextIcon: React.ComponentType<WidgetProps<C> & WithScalarValue>
        NumberIcon: React.ComponentType<WidgetProps<C> & WithScalarValue>
        NumberSlider: React.ComponentType<WidgetProps<C>>
        SimpleList: React.ComponentType<WidgetProps<C>>
        GenericList: React.ComponentType<WidgetProps<C>>
        OptionsCheck: React.ComponentType<WidgetProps<C>>
        OptionsRadio: React.ComponentType<WidgetProps<C>>
        Select: React.ComponentType<WidgetProps<C> & WithScalarValue>
        SelectMulti: React.ComponentType<WidgetProps<C>>
        Card: React.ComponentType<WidgetProps<C>>
        LabelBox: React.ComponentType<WidgetProps<C>>
        FormGroup: React.ComponentType<WidgetProps<C>>
    } & {
        // todo: remove this generic typing and use better generics/factories
        // allow adding any further custom widgets
        [key: string]: WidgetType<C>
    }
}

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

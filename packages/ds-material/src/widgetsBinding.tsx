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
import { ErrorFallbackProps, WidgetProps, WidgetsBindingFactory, WidgetType, WithScalarValue } from '@ui-schema/ui-schema'
import { InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'
import { List } from 'immutable'

const MyFallbackComponent: React.ComponentType<ErrorFallbackProps> = ({type, widget}) => (
    <div>
        <p><strong>System Error in Widget!</strong></p>
        <p><strong>Type:</strong> {List.isList(type) ? type.join(', ') : (type || '-')}</p>
        <p><strong>Widget:</strong> {widget || '-'}</p>
    </div>
)

export interface MuiWidgetsBindingTypes<C extends {} = {}, W extends MuiWidgetBinding = MuiWidgetBinding> {
    string: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    boolean: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    number: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    integer: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
}

export interface MuiWidgetsBindingCustom<C extends {} = {}, W extends MuiWidgetBinding = MuiWidgetBinding> {
    Accordions: React.ComponentType<WidgetProps<W> & C>
    Text: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    StringIcon: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    TextIcon: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    NumberIcon: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    NumberSlider: React.ComponentType<WidgetProps<W> & C>
    SimpleList: React.ComponentType<WidgetProps<W> & C>
    GenericList: React.ComponentType<WidgetProps<W> & C>
    OptionsCheck: React.ComponentType<WidgetProps<W> & C>
    OptionsRadio: React.ComponentType<WidgetProps<W> & C>
    Select: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    SelectMulti: React.ComponentType<WidgetProps<W> & C>
    Card: React.ComponentType<WidgetProps<W> & C>
    LabelBox: React.ComponentType<WidgetProps<W> & C>
    FormGroup: React.ComponentType<WidgetProps<W> & C>

    [key: string]: WidgetType<C, W> | WidgetType<C>
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

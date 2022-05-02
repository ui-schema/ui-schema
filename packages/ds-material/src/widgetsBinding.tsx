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
import { WidgetProps, WidgetType } from '@ui-schema/ui-schema/Widget'
import { UIStoreActions } from '@ui-schema/ui-schema/UIStoreActions'
import { WithScalarValue } from '@ui-schema/ui-schema/UIStore'
import { WidgetsBindingFactory } from '@ui-schema/ui-schema/WidgetsBinding'
import { InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'
import { ErrorFallback } from '@ui-schema/ds-material/ErrorFallback'

export interface MuiWidgetsBindingTypes<C extends {} = {}, W extends MuiWidgetBinding = MuiWidgetBinding> {
    string: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    boolean: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    number: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
    integer: React.ComponentType<WidgetProps<W> & C & WithScalarValue>
}

export interface MuiWidgetsBindingCustom<C extends {} = {}, W extends MuiWidgetBinding = MuiWidgetBinding, A = UIStoreActions> {
    [key: string]: WidgetType<C, W, A> | WidgetType<C, WidgetsBindingFactory, A>
}

export interface MuiWidgetBindingExtra {
    InfoRenderer?: React.ComponentType<InfoRendererProps>
}

export type MuiWidgetBinding<C extends {} = {}> = WidgetsBindingFactory<MuiWidgetBindingExtra, MuiWidgetsBindingTypes<C>, MuiWidgetsBindingCustom<C>>

export const widgets: MuiWidgetBinding = {
    ErrorFallback: ErrorFallback,
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

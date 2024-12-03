import {
    MuiWidgetBinding as MuiWidgetBindingNext,
    MuiWidgetsBindingTypes as MuiWidgetsBindingTypesNext,
    MuiWidgetsBindingCustom as MuiWidgetsBindingCustomNext,
    MuiWidgetBindingExtra as MuiWidgetBindingExtraNext,
} from '@ui-schema/ds-material/BindingType'
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
import { pluginStack } from '@ui-schema/ds-material/pluginStack'
import { validators } from '@ui-schema/ui-schema/Validators/validators'
import { CardRenderer, FormGroup, LabelBox } from '@ui-schema/ds-material/Widgets'
import { widgets as widgetsBasic } from '@ui-schema/ds-material/widgetsBindingBasic'
import { UIStoreActions } from '@ui-schema/ui-schema/UIStoreActions'
import { WidgetsBindingFactory } from '@ui-schema/ui-schema/WidgetsBinding'

// exports of types for backwards compatibility
export type MuiWidgetsBindingTypes<C extends {} = {}, W extends MuiWidgetBindingNext = MuiWidgetBindingNext> = MuiWidgetsBindingTypesNext<C, W>
export type MuiWidgetsBindingCustom<C extends {} = {}, W extends MuiWidgetBindingNext = MuiWidgetBindingNext, A = UIStoreActions> = MuiWidgetsBindingCustomNext<C, W, A>
export type MuiWidgetBindingExtra = MuiWidgetBindingExtraNext
export type MuiWidgetBinding<C extends {} = {}> = WidgetsBindingFactory<MuiWidgetBindingExtra, MuiWidgetsBindingTypes<C>, MuiWidgetsBindingCustom<C>>

export const widgets: MuiWidgetBinding = {
    ...widgetsBasic,
    pluginStack: pluginStack,
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

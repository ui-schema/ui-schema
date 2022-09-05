import { TextRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { Select, SelectMulti } from '@ui-schema/ds-material/Widgets/Select'
import { OptionsCheck } from '@ui-schema/ds-material/Widgets/OptionsCheck'
import { OptionsRadio } from '@ui-schema/ds-material/Widgets/OptionsRadio'
import { NumberIconRenderer, StringIconRenderer, TextIconRenderer } from '@ui-schema/ds-material/Widgets/TextFieldIcon'
import { SimpleList } from '@ui-schema/ds-material/Widgets/SimpleList'
import { GenericList } from '@ui-schema/ds-material/Widgets/GenericList'
import { NumberSlider } from '@ui-schema/ds-material/Widgets/NumberSlider'
import { AccordionsRenderer } from '@ui-schema/ds-material/Widgets/Accordions'
import { CardRenderer } from '@ui-schema/ds-material/Widgets/Card'
import { FormGroup } from '@ui-schema/ds-material/Widgets/FormGroup'
import { LabelBox } from '@ui-schema/ds-material/Widgets/LabelBox'
import { MuiWidgetsBindingCustom } from '@ui-schema/ds-material/WidgetsBinding'
import { WidgetType } from '@ui-schema/react/Widgets'

export const widgetsCustom = <C extends {} = {}>(): MuiWidgetsBindingCustom<C> => {
    return {
        Accordions: AccordionsRenderer,
        Text: TextRenderer,
        StringIcon: StringIconRenderer as WidgetType<C>,
        TextIcon: TextIconRenderer as WidgetType<C>,
        NumberIcon: NumberIconRenderer as WidgetType<C>,
        NumberSlider: NumberSlider,
        SimpleList: SimpleList as WidgetType<C>,
        GenericList: GenericList,
        OptionsCheck: OptionsCheck as WidgetType<C>,
        OptionsRadio: OptionsRadio as WidgetType<C>,
        Select: Select,
        SelectMulti: SelectMulti,
        Card: CardRenderer,
        LabelBox: LabelBox,
        FormGroup: FormGroup,
    }
}

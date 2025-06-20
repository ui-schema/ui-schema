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
import { MuiWidgetsBindingCustom } from '@ui-schema/ds-material/BindingType'

// todo: named `bindingExtended` to not clash with the `customWidgets` name often used in demo/docs for the binding itself,
//       should be refined further, but also it may be better to remove any default binding for the `custom` widgets
export const bindingExtended = {
    Accordions: AccordionsRenderer,
    Text: TextRenderer,
    StringIcon: StringIconRenderer,
    TextIcon: TextIconRenderer,
    NumberIcon: NumberIconRenderer,
    NumberSlider: NumberSlider,
    SimpleList: SimpleList,
    GenericList: GenericList,
    OptionsCheck: OptionsCheck,
    OptionsRadio: OptionsRadio,
    Select: Select,
    SelectMulti: SelectMulti,
    Card: CardRenderer,
    LabelBox: LabelBox,
    FormGroup: FormGroup,
} satisfies MuiWidgetsBindingCustom

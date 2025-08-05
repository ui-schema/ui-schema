import { TextRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { Select, SelectMultiBase as SelectMulti } from '@ui-schema/ds-material/Widgets/Select'
import { OptionsCheck } from '@ui-schema/ds-material/Widgets/OptionsCheck'
import { OptionsRadio } from '@ui-schema/ds-material/Widgets/OptionsRadio'
import { NumberIconRenderer, StringIconRenderer, TextIconRenderer } from '@ui-schema/ds-material/Widgets/TextFieldIcon'
import { SimpleListWrapper as SimpleList } from '@ui-schema/ds-material/Widgets/SimpleList'
import { GenericList } from '@ui-schema/ds-material/Widgets/GenericList'
import { NumberSlider } from '@ui-schema/ds-material/Widgets/NumberSlider'
import { AccordionsRenderer } from '@ui-schema/ds-material/Widgets/Accordions'
import { CardRenderer } from '@ui-schema/ds-material/Widgets/Card'
import { FormGroupBase as FormGroup } from '@ui-schema/ds-material/Widgets/FormGroup'
import { LabelBox } from '@ui-schema/ds-material/Widgets/LabelBox'
import { MuiBindingWidgets } from '@ui-schema/ds-material/BindingType'

export const widgetsExtended = {
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
} satisfies MuiBindingWidgets

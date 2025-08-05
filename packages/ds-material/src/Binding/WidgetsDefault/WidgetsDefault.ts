import { NumberRenderer, StringRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { BoolRenderer } from '@ui-schema/ds-material/Widgets/OptionsBoolean'
import { ObjectRendererBase as ObjectRenderer } from '@ui-schema/react/ObjectRenderer'
import type { MuiBindingWidgets } from '@ui-schema/ds-material/BindingType'

export const widgetsDefault = {
    string: StringRenderer,
    boolean: BoolRenderer,
    number: NumberRenderer,
    integer: NumberRenderer,
    'integer+number': NumberRenderer,
    object: ObjectRenderer,
} satisfies MuiBindingWidgets

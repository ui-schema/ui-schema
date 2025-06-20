import { NumberRenderer, StringRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { BoolRenderer } from '@ui-schema/ds-material/Widgets/OptionsBoolean'
import { ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import { MuiWidgetsBindingTypes } from '@ui-schema/ds-material/BindingType'
import { GroupRenderer } from '@ui-schema/ds-material/Grid'
import { ErrorFallback } from '@ui-schema/ds-material/ErrorFallback'
import { WidgetsBindingComponents } from '@ui-schema/react/Widgets'
import { VirtualWidgetRenderer } from '@ui-schema/react/VirtualWidgetRenderer'
import { NoWidget } from '@ui-schema/react/NoWidget'

export const typeWidgets = {
    string: StringRenderer,
    boolean: BoolRenderer,
    number: NumberRenderer,
    integer: NumberRenderer,
    object: ObjectRenderer,
} satisfies MuiWidgetsBindingTypes

export const baseComponents = {
    ErrorFallback: ErrorFallback,
    GroupRenderer: GroupRenderer,
    VirtualRenderer: VirtualWidgetRenderer,
    NoWidget: NoWidget,
} satisfies WidgetsBindingComponents

import { NumberRenderer, StringRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { BoolRenderer } from '@ui-schema/ds-material/Widgets/OptionsBoolean'
import { ObjectRendererBase as ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import type { MuiWidgetsBindingWidgets } from '@ui-schema/ds-material/BindingType'
import { GroupRenderer } from '@ui-schema/ds-material/Grid'
import { ErrorFallback } from '@ui-schema/ds-material/ErrorFallback'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import type { WidgetsBindingComponents } from '@ui-schema/react/Widgets'
import { VirtualWidgetRenderer } from '@ui-schema/react-json-schema/VirtualWidgetRenderer'
import { NoWidget } from '@ui-schema/react/NoWidget'
import type { ComponentType } from 'react'

export const typeWidgets = {
    string: StringRenderer,
    boolean: BoolRenderer,
    number: NumberRenderer,
    integer: NumberRenderer,
    object: ObjectRenderer,
} satisfies MuiWidgetsBindingWidgets

export const baseComponents = {
    WidgetRenderer: WidgetRenderer,
    ErrorFallback: ErrorFallback,
    GroupRenderer: GroupRenderer,
    VirtualRenderer: VirtualWidgetRenderer,
    NoWidget: NoWidget,
} satisfies WidgetsBindingComponents & { WidgetRenderer?: ComponentType<WidgetPluginProps> }

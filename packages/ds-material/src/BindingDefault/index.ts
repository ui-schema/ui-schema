import { NumberRenderer, StringRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { BoolRenderer } from '@ui-schema/ds-material/Widgets/OptionsBoolean'
import { ObjectRendererBase as ObjectRenderer } from '@ui-schema/react/ObjectRenderer'
import type { MuiBindingWidgets } from '@ui-schema/ds-material/Binding'
import { GroupRenderer } from '@ui-schema/ds-material/Grid'
import { ErrorFallback } from '@ui-schema/ds-material/ErrorFallback'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import type { BindingComponents } from '@ui-schema/react/Widget'
import { VirtualWidgetRenderer } from '@ui-schema/react/VirtualWidgetRenderer'
import { NoWidget } from '@ui-schema/react/NoWidget'
import type { ComponentType } from 'react'

export const typeWidgets = {
    string: StringRenderer,
    boolean: BoolRenderer,
    number: NumberRenderer,
    integer: NumberRenderer,
    object: ObjectRenderer,
} satisfies MuiBindingWidgets

export const baseComponents = {
    WidgetRenderer: WidgetRenderer,
    ErrorFallback: ErrorFallback,
    GroupRenderer: GroupRenderer,
    VirtualRenderer: VirtualWidgetRenderer,
    NoWidget: NoWidget,
} satisfies BindingComponents & { WidgetRenderer?: ComponentType<WidgetPluginProps<any>> }

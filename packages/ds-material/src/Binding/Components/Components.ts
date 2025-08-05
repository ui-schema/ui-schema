import { GroupRenderer } from '@ui-schema/ds-material/GroupRenderer'
import { ErrorFallback } from '@ui-schema/ds-material/ErrorFallback'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import type { BindingComponents } from '@ui-schema/react/Widget'
import { VirtualWidgetRenderer } from '@ui-schema/react/VirtualWidgetRenderer'
import { NoWidget } from '@ui-schema/react/NoWidget'
import type { ComponentType } from 'react'

export const bindingComponents = {
    WidgetRenderer: WidgetRenderer,
    ErrorFallback: ErrorFallback,
    GroupRenderer: GroupRenderer,
    VirtualRenderer: VirtualWidgetRenderer,
    NoWidget: NoWidget,
} satisfies BindingComponents & { WidgetRenderer?: ComponentType<WidgetPluginProps<any>> }

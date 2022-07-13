import { MuiWidgetBinding } from '@ui-schema/ds-material/WidgetsBinding'
import { GroupRenderer } from '@ui-schema/ds-material/Grid'
import { ErrorFallback } from '@ui-schema/ds-material/ErrorFallback'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { VirtualWidgetRenderer } from '@ui-schema/react/VirtualWidgetRenderer'
import { NoWidget } from '@ui-schema/react/NoWidget'

export const defineBinding = <C extends {} = {}>(
    binding: Omit<Partial<MuiWidgetBinding<C>>, 'ErrorFallback' | 'GroupRenderer' | 'WidgetRenderer' | 'VirtualRenderer' | 'NoWidget'> = {},
): MuiWidgetBinding<C> => {
    return {
        ErrorFallback: ErrorFallback,
        GroupRenderer: GroupRenderer,
        WidgetRenderer: WidgetRenderer,
        VirtualRenderer: VirtualWidgetRenderer,
        NoWidget: NoWidget,
        ...binding,
    } as MuiWidgetBinding<C>
}

import { MuiWidgetsBinding } from '@ui-schema/ds-material/BindingType'
import { GroupRenderer } from '@ui-schema/ds-material/Grid'
import { ErrorFallback } from '@ui-schema/ds-material/ErrorFallback'
import { VirtualWidgetRenderer } from '@ui-schema/react/VirtualWidgetRenderer'
import { NoWidget } from '@ui-schema/react/NoWidget'

export const define = <WE extends {} = {}, C extends {} = {}>(
    binding: Omit<Partial<MuiWidgetsBinding<WE, C>>, 'ErrorFallback' | 'GroupRenderer' | 'VirtualRenderer' | 'NoWidget'>,
): MuiWidgetsBinding<WE, C> => {
    return {
        ErrorFallback: ErrorFallback,
        GroupRenderer: GroupRenderer,
        VirtualRenderer: VirtualWidgetRenderer,
        NoWidget: NoWidget,
        ...binding,
    } as MuiWidgetsBinding<WE, C>
}

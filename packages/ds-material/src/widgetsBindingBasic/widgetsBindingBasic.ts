import { MuiWidgetBinding } from '@ui-schema/ds-material/BindingType'
import { RootRenderer, GroupRenderer } from '@ui-schema/ds-material/Grid'
import { WidgetRenderer } from '@ui-schema/ui-schema/WidgetRenderer'
import { ErrorFallback } from '@ui-schema/ds-material/ErrorFallback'

export const widgets: MuiWidgetBinding = {
    ErrorFallback: ErrorFallback,
    RootRenderer,
    GroupRenderer,
    WidgetRenderer,
    pluginStack: [],
    pluginSimpleStack: [],
    types: {},
    custom: {},
}

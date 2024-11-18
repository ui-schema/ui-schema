import { MuiWidgetBinding } from '@ui-schema/ds-material/BindingType'
import { NumberRenderer, StringRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { BoolRenderer } from '@ui-schema/ds-material/Widgets/OptionsBoolean'
import { RootRenderer, GroupRenderer } from '@ui-schema/ds-material/Grid'
import { pluginStack } from '@ui-schema/ds-material/pluginStack'
import { WidgetRenderer } from '@ui-schema/ui-schema/WidgetRenderer'
import { validators } from '@ui-schema/ui-schema/Validators/validators'
import { ErrorFallback } from '@ui-schema/ds-material/ErrorFallback'

export const widgets: MuiWidgetBinding = {
    ErrorFallback: ErrorFallback,
    RootRenderer,
    GroupRenderer,
    WidgetRenderer,
    pluginStack,
    pluginSimpleStack: validators,
    types: {
        string: StringRenderer,
        boolean: BoolRenderer,
        number: NumberRenderer,
        integer: NumberRenderer,
    },
    custom: {},
}

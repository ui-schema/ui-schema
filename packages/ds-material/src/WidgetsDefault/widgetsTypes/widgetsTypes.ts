import { NumberRenderer, StringRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { BoolRenderer } from '@ui-schema/ds-material/Widgets/OptionsBoolean'
import { MuiWidgetsBindingTypes } from '@ui-schema/ds-material/WidgetsBinding'
import { ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'

export const widgetsTypes = <C extends {} = {}>(): MuiWidgetsBindingTypes<C> => {
    return {
        string: StringRenderer,
        boolean: BoolRenderer,
        number: NumberRenderer,
        integer: NumberRenderer,
        object: ObjectRenderer,
    }
}

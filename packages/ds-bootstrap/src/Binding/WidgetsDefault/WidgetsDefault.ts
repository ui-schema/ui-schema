import { BtsBinding } from '@ui-schema/ds-bootstrap/BindingType'
import { NumberRenderer, StringRenderer } from '@ui-schema/ds-bootstrap/Widgets/TextField'
import { BoolRenderer } from '@ui-schema/ds-bootstrap/Widgets/OptionsBoolean'
import { ObjectRendererBase as ObjectRenderer } from '@ui-schema/react/ObjectRenderer'

export const widgetsDefault = {
    string: StringRenderer,
    boolean: BoolRenderer,
    number: NumberRenderer,
    integer: NumberRenderer,
    'integer+number': NumberRenderer,
    object: ObjectRenderer,
} satisfies BtsBinding['widgets']

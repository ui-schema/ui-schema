import { NumberRenderer, StringRenderer } from '@ui-schema/ds-material/Widgets/TextField'
import { BoolRenderer } from '@ui-schema/ds-material/Widgets/OptionsBoolean'
import { MuiWidgetsBindingTypes } from '@ui-schema/ds-material/BindingType'
import { ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import React from 'react'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { WithScalarValue } from '@ui-schema/react/UIStore'

export const widgetsTypes = <C extends {} = {}>(): MuiWidgetsBindingTypes<C> => {
    return {
        string: StringRenderer,
        boolean: BoolRenderer as React.ComponentType<WidgetProps & C & WithScalarValue>,
        number: NumberRenderer,
        integer: NumberRenderer,
        object: ObjectRenderer as React.ComponentType<WidgetProps & C>,
    }
}

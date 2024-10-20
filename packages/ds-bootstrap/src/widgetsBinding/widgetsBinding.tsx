import { ErrorFallbackProps, WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import React from 'react'
import { NumberRenderer, StringRenderer, TextRenderer } from '@ui-schema/ds-bootstrap/Widgets/TextField'
import { Select, SelectMulti } from '@ui-schema/ds-bootstrap/Widgets/Select'
import { BoolRenderer } from '@ui-schema/ds-bootstrap/Widgets/OptionsBoolean'
import { OptionsCheck } from '@ui-schema/ds-bootstrap/Widgets/OptionsCheck'
import { OptionsRadio } from '@ui-schema/ds-bootstrap/Widgets/OptionsRadio'
import { SimpleList } from '@ui-schema/ds-bootstrap/Widgets/SimpleList'
import { GroupRenderer } from '@ui-schema/ds-bootstrap/Grid'
import { widgetPlugins } from '@ui-schema/ds-bootstrap/widgetPlugins'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { getValidators } from '@ui-schema/json-schema/getValidators'
import { ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'

const MyFallbackComponent = ({type, widget}: ErrorFallbackProps) => (
    <div>
        <p><strong>System Error in Widget!</strong></p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Widget:</strong> {widget}</p>
    </div>
)

const validators = getValidators()

export interface BtsWidgetBinding extends WidgetsBindingFactory {
    types: {
        object: React.ComponentType<WidgetProps>
        string: React.ComponentType<WidgetProps>
        boolean: React.ComponentType<WidgetProps>
        number: React.ComponentType<WidgetProps>
        integer: React.ComponentType<WidgetProps>
    }
    custom: {
        Text: React.ComponentType<WidgetProps>
        SimpleList: React.ComponentType<WidgetProps>
        OptionsCheck: React.ComponentType<WidgetProps>
        OptionsRadio: React.ComponentType<WidgetProps>
        Select: React.ComponentType<WidgetProps>
        SelectMulti: React.ComponentType<WidgetProps>
    }
}

export const widgets: BtsWidgetBinding = {
    ErrorFallback: MyFallbackComponent,
    GroupRenderer,
    WidgetRenderer,
    widgetPlugins,
    schemaPlugins: validators,
    // todo: fix all existing bootstrap widget typings
    types: {
        object: ObjectRenderer,
        string: StringRenderer as React.ComponentType<WidgetProps>,
        boolean: BoolRenderer as React.ComponentType<WidgetProps>,
        number: NumberRenderer as React.ComponentType<WidgetProps>,
        integer: NumberRenderer as React.ComponentType<WidgetProps>,
    },
    custom: {
        Text: TextRenderer as React.ComponentType<WidgetProps>,
        SimpleList,
        OptionsCheck,
        OptionsRadio: OptionsRadio as React.ComponentType<WidgetProps>,
        Select: Select as React.ComponentType<WidgetProps>,
        SelectMulti,
    },
}

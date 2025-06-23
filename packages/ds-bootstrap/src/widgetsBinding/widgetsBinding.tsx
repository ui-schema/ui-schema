import { ErrorFallbackProps, WidgetPropsComplete, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import React from 'react'
import { NumberRenderer, StringRenderer, TextRenderer } from '@ui-schema/ds-bootstrap/Widgets/TextField'
import { Select, SelectMulti } from '@ui-schema/ds-bootstrap/Widgets/Select'
import { BoolRenderer } from '@ui-schema/ds-bootstrap/Widgets/OptionsBoolean'
import { OptionsCheck } from '@ui-schema/ds-bootstrap/Widgets/OptionsCheck'
import { OptionsRadio } from '@ui-schema/ds-bootstrap/Widgets/OptionsRadio'
import { SimpleList } from '@ui-schema/ds-bootstrap/Widgets/SimpleList'
import { GroupRenderer } from '@ui-schema/ds-bootstrap/Grid'
import { ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'

const MyFallbackComponent = ({type, widget}: ErrorFallbackProps) => (
    <div>
        <p><strong>System Error in Widget!</strong></p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Widget:</strong> {widget}</p>
    </div>
)

export type BtsWidgetBinding = WidgetsBindingFactory<{
    string?: React.ComponentType<WidgetPropsComplete>
    boolean?: React.ComponentType<WidgetPropsComplete>
    number?: React.ComponentType<WidgetPropsComplete>
    integer?: React.ComponentType<WidgetPropsComplete>
    null?: React.ComponentType<WidgetPropsComplete>
    object?: React.ComponentType<WidgetPropsComplete>
    array?: React.ComponentType<WidgetPropsComplete>
}, {
    [k: string]: React.ComponentType<WidgetPropsComplete>
}>

export const widgets: BtsWidgetBinding = {
    ErrorFallback: MyFallbackComponent,
    GroupRenderer,
    widgets: {
        types: {
            object: ObjectRenderer,
            string: StringRenderer,
            boolean: BoolRenderer,
            number: NumberRenderer,
            integer: NumberRenderer,
        },
        custom: {
            Text: TextRenderer,
            SimpleList,
            OptionsCheck,
            OptionsRadio: OptionsRadio,
            Select: Select,
            SelectMulti,
        },
    },
}

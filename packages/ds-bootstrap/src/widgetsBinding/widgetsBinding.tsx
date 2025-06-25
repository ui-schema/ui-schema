import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import type { ErrorFallbackProps, WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import type { SchemaKeywordType } from '@ui-schema/ui-schema/CommonTypings'
import type { ComponentType } from 'react'
import { NumberRenderer, StringRenderer, TextRenderer } from '@ui-schema/ds-bootstrap/Widgets/TextField'
import { Select, SelectMulti } from '@ui-schema/ds-bootstrap/Widgets/Select'
import { BoolRenderer } from '@ui-schema/ds-bootstrap/Widgets/OptionsBoolean'
import { OptionsCheck } from '@ui-schema/ds-bootstrap/Widgets/OptionsCheck'
import { OptionsRadio } from '@ui-schema/ds-bootstrap/Widgets/OptionsRadio'
import { SimpleList } from '@ui-schema/ds-bootstrap/Widgets/SimpleList'
import { GroupRenderer } from '@ui-schema/ds-bootstrap/Grid'
import { ObjectRendererBase as ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'

const MyFallbackComponent = ({type, widget}: ErrorFallbackProps) => (
    <div>
        <p><strong>System Error in Widget!</strong></p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Widget:</strong> {widget}</p>
    </div>
)

export type BtsWidgetBinding = WidgetsBindingFactory<
    {
        [K in SchemaKeywordType]?: ComponentType<WidgetProps>
    } &
    {
        [k: string]: ComponentType<WidgetProps>
    }
>

export const widgets: BtsWidgetBinding = {
    ErrorFallback: MyFallbackComponent,
    WidgetRenderer: WidgetRenderer,
    GroupRenderer: GroupRenderer,
    widgets: {
        object: ObjectRenderer,
        string: StringRenderer,
        boolean: BoolRenderer,
        number: NumberRenderer,
        integer: NumberRenderer,
        Text: TextRenderer,
        SimpleList: SimpleList,
        OptionsCheck: OptionsCheck,
        OptionsRadio: OptionsRadio,
        Select: Select,
        SelectMulti: SelectMulti,
    },
}

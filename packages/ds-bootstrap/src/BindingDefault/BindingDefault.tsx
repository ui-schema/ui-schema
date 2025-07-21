import type { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import type { MinimalComponentType, ErrorFallbackProps, WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'
import type { SchemaKeywordType } from '@ui-schema/ui-schema/CommonTypings'
import type { ComponentType } from 'react'
import { NumberRenderer, StringRenderer, TextRenderer } from '@ui-schema/ds-bootstrap/Widgets/TextField'
import { Select, SelectMulti } from '@ui-schema/ds-bootstrap/Widgets/Select'
import { BoolRenderer } from '@ui-schema/ds-bootstrap/Widgets/OptionsBoolean'
import { OptionsCheck } from '@ui-schema/ds-bootstrap/Widgets/OptionsCheck'
import { OptionsRadio } from '@ui-schema/ds-bootstrap/Widgets/OptionsRadio'
import { SimpleList } from '@ui-schema/ds-bootstrap/Widgets/SimpleList'
import { GroupRenderer } from '@ui-schema/ds-bootstrap/Grid'
import { ObjectRendererBase as ObjectRenderer } from '@ui-schema/react/ObjectRenderer'

const MyFallbackComponent = ({type, widget}: ErrorFallbackProps) => (
    <div>
        <p><strong>System Error in Widget!</strong></p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Widget:</strong> {widget}</p>
    </div>
)

export type BtsBinding<A = UIStoreActions, WP extends WidgetProps<{}, A> = WidgetProps<{}, A>> =
    Omit<BindingTypeGeneric<
        {
            [K in SchemaKeywordType]?: ComponentType<WidgetProps>
        } &
        {
            [k: string]: ComponentType<WidgetProps>
        }
    >, 'widgetPlugins'> &
    {
        widgetPlugins?: MinimalComponentType<WP & Omit<WidgetPluginProps<{}, A>, keyof WP>>[]
        WidgetRenderer?: MinimalComponentType<WP & Omit<WidgetPluginProps<{}, A>, keyof WP>>
    }

export const widgets: BtsBinding = {
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

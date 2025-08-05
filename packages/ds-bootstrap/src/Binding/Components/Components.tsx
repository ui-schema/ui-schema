import { BtsBinding } from '@ui-schema/ds-bootstrap/BindingType'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import type { ErrorFallbackProps } from '@ui-schema/react/Widget'
import { GroupRenderer } from '@ui-schema/ds-bootstrap/Grid'

const MyFallbackComponent = ({type, widget}: ErrorFallbackProps) => (
    <div>
        <p><strong>System Error in Widget!</strong></p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Widget:</strong> {widget}</p>
    </div>
)

export const bindingComponents = {
    ErrorFallback: MyFallbackComponent,
    WidgetRenderer: WidgetRenderer,
    GroupRenderer: GroupRenderer,
} satisfies Pick<BtsBinding, 'ErrorFallback' | 'WidgetRenderer' | 'GroupRenderer'>

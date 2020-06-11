import * as React from 'react'
import { WidgetPropsExtended } from '@ui-schema/ui-schema/Widget'

export interface WidgetPropsBoolean extends WidgetPropsExtended {
    value: boolean
}

export function BoolRenderer<P extends WidgetPropsBoolean>(props: P): React.Component<P>

import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface WidgetPropsBoolean extends WidgetProps {
    value: boolean
}

export function BoolRenderer<P extends WidgetPropsBoolean>(props: P): React.Component<P>

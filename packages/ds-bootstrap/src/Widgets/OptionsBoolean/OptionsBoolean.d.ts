import * as React from 'react'
import { WidgetPropsWithValue } from '@ui-schema/ui-schema/Widget'

export interface WidgetPropsBoolean extends WidgetPropsWithValue {
    value: boolean
}

export function BoolRenderer<P extends WidgetPropsBoolean>(props: P): React.Component<P>

import * as React from 'react'
import { WidgetPropsWithValue } from '@ui-schema/ui-schema/Widget'

export interface WidgetPropsRadio extends WidgetPropsWithValue {
    value: string
}

export function OptionsRadio<P extends WidgetPropsRadio>(props: P): React.Component<P>

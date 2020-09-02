import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface WidgetPropsRadio extends WidgetProps {
    value: string
}

export function OptionsRadio<P extends WidgetPropsRadio>(props: P): React.ReactElement<P>

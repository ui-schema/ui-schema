import * as React from 'react'
import { WidgetPropsExtended } from '@ui-schema/ui-schema/Widget'

export interface WidgetPropsRadio extends WidgetPropsExtended {
    value: string
}

export function OptionsRadio<P extends WidgetPropsRadio>(props: P): React.Component<P>

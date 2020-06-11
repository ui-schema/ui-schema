import * as React from 'react'
import { WidgetExtendedCheckValid } from '@ui-schema/ui-schema/Widget'

export interface OptionsRadioRendererProps extends WidgetExtendedCheckValid {
    row: boolean
    value: string
}

export function OptionsRadio<P extends OptionsRadioRendererProps>(props: P): React.Component<P>

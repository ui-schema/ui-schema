import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface OptionsRadioRendererProps extends WidgetProps {
    row: boolean
    value: string
}

export function OptionsRadio<P extends OptionsRadioRendererProps>(props: P): React.ReactElement<P>

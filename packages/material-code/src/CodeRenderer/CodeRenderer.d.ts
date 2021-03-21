import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface CodeRendererProps extends WidgetProps {
    value: string
    format: string
}

export function CodeRenderer<P extends CodeRendererProps>(props: P): React.ReactElement<P>

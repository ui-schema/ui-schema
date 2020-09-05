import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface OptionsCheckRendererProps extends WidgetProps {
    row?: boolean
}

export function OptionsCheck<P extends OptionsCheckRendererProps>(props: P): React.ReactElement<P>

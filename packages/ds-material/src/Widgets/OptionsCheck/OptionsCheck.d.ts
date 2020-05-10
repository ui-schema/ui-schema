import * as React from 'react'
import { WidgetRendererProps } from '../../../../ui-schema/src/WidgetRendererProps'

export interface OptionsCheckRendererProps extends WidgetRendererProps {
    valid: boolean
    row: boolean
    required: boolean
}

export function OptionsCheck<P extends OptionsCheckRendererProps>(props: P): React.Component<P>

import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { valid, required } from '@ui-schema/ui-schema/CommonTypings'

export interface OptionsCheckRendererProps extends WidgetProps {
    valid: valid
    row: boolean
    required: required
}

export function OptionsCheck<P extends OptionsCheckRendererProps>(props: P): React.Component<P>

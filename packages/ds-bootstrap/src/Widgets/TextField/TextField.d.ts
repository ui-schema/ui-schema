import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface StringRendererProps extends WidgetProps {
    multiline?: boolean
    type?: string
    rows?: number
    value: string
}

export interface NumberRendererProps extends WidgetProps {
    type: string
    value: number
}

export function StringRenderer<P extends StringRendererProps>(props: P): React.ReactElement<P>

export function NumberRenderer<P extends NumberRendererProps>(props: P): React.ReactElement<P>

export function TextRenderer<P extends StringRendererProps>(props: P): React.ReactElement<P>

import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema'
import { StringRendererProps, NumberRendererProps, TextRendererProps } from '@ui-schema/ds-material/Widgets/TextField'

/**
 * @deprecated will be removed in v0.3.0, as not needed
 */
export interface TextFieldIconProps extends StringRendererProps {
    InputProps?: any
}

export function StringIconRenderer<P extends WidgetProps>(props: P & StringRendererProps): React.ReactElement

export function TextIconRenderer<P extends WidgetProps>(props: P & TextRendererProps): React.ReactElement

export function NumberIconRenderer<P extends WidgetProps>(props: P & NumberRendererProps): React.ReactElement

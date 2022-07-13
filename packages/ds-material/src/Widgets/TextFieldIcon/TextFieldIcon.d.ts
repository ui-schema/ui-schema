import React from 'react'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { StringRendererProps, NumberRendererProps, TextRendererProps } from '@ui-schema/ds-material/Widgets/TextField'

export function StringIconRenderer<P extends WidgetProps>(props: P & StringRendererProps): React.ReactElement

export function TextIconRenderer<P extends WidgetProps>(props: P & TextRendererProps): React.ReactElement

export function NumberIconRenderer<P extends WidgetProps>(props: P & NumberRendererProps): React.ReactElement

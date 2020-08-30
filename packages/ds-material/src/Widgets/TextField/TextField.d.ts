import React, { CSSProperties } from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface StringRendererProps extends WidgetProps {
    multiline?: boolean
    type?: string
    rows?: number
    rowsMax?: number
    style?: CSSProperties
    onClick: React.MouseEvent
    onFocus: React.MouseEvent
    onBlur: React.MouseEvent
    onKeyUp: React.MouseEvent
    onKeyDown: React.MouseEvent
    inputProps: any
    InputProps: any
    inputRef: any
}

export interface NumberRendererProps extends StringRendererProps {
    type: string
}

export interface TextRendererProps extends StringRendererProps {
    multiline: true
    rows: number
    rowsMax: number
}

export function StringRenderer<P extends StringRendererProps>(props: P): React.ReactElement<P>

export function NumberRenderer<P extends NumberRendererProps>(props: P): React.ReactElement<P>

export function TextRenderer<P extends TextRendererProps>(props: P): React.ReactElement<P>

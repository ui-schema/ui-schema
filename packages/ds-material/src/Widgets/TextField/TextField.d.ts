import React from 'react'
import { WidgetExtendedCheckValid } from '@ui-schema/ui-schema/Widget'
import { rows, rowsMax, style, multiline, type } from '@ui-schema/ui-schema/CommonTypings'

export interface StringRendererProps extends WidgetExtendedCheckValid {
    multiline?: multiline
    type: type
    rows?: rows
    rowsMax?: rowsMax
    style: style
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
    type: type
}

export interface TextRendererProps extends StringRendererProps {
    multiline: true
    rows: rows
    rowsMax: rowsMax
}

export function StringRenderer<P extends StringRendererProps>(props: P): React.Component<P>

export function NumberRenderer<P extends NumberRendererProps>(props: P): React.Component<P>

export function TextRenderer<P extends TextRendererProps>(props: P): React.Component<P>

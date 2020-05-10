import React from 'react'
import { WidgetRendererPropsExtendedCheckValid, rows, rowsMax } from '../../../../ui-schema/src/WidgetRendererProps'

export interface StringRendererProps extends WidgetRendererPropsExtendedCheckValid {
    multiline?: boolean
    type: string
    rows?: rows
    rowsMax?: rowsMax
    style: string
    onClick: Function
    onFocus: Function
    onBlur: Function
    onKeyUp: Function
    onKeyDown: Function
    inputProps: any
    InputProps: any
    inputRef: any
}

export interface NumberRendererProps extends StringRendererProps {
    type: string
}

export interface TextRendererProps extends StringRendererProps {
    multiline: true
    rows: rows
    rowsMax: rowsMax
}

export function StringRenderer<P extends StringRendererProps>(props: P): React.Component<P>

export function NumberRenderer<P extends NumberRendererProps>(props: P): React.Component<P>

export function TextRenderer<P extends TextRendererProps>(props: P): React.Component<P>

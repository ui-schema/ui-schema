import React, { CSSProperties } from 'react'
import { InputProps } from '@material-ui/core/Input'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface StringRendererProps {
    multiline?: boolean
    type?: string
    rows?: number
    rowsMax?: number
    style?: CSSProperties
    onClick?: React.MouseEvent
    onFocus?: React.MouseEvent
    onBlur?: React.MouseEvent
    onKeyUp?: React.MouseEvent
    onKeyDown?: React.MouseEvent
    inputProps?: InputProps['inputProps']
    InputProps?: Partial<InputProps>
    inputRef?: any
}

export function convertStringToNumber(value: string | number | any, type: string): any | string | number

export function StringRenderer<P extends StringRendererProps & WidgetProps>(props: P): React.ReactElement<P>

export function NumberRenderer<P extends StringRendererProps & WidgetProps>(props: P): React.ReactElement<P>

export function TextRenderer<P extends StringRendererProps & WidgetProps>(props: P): React.ReactElement<P>

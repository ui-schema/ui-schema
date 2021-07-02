import React, { CSSProperties } from 'react'
import { InputProps } from '@material-ui/core/Input'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { WithScalarValue } from '@ui-schema/ui-schema'

export interface StringRendererBaseProps {
    type?: string
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

export interface StringRendererProps extends StringRendererBaseProps {
    multiline?: boolean
    rows?: number
    rowsMax?: number
}

export interface TextRendererProps extends StringRendererProps {
    multiline?: true
}

export interface NumberRendererProps extends StringRendererBaseProps {
    steps?: number | 'any'
}

//export function StringRenderer<P extends WidgetProps = WidgetProps>(props: P & WithScalarValue & StringRendererProps): React.ReactElement
export function StringRenderer<P extends WidgetProps = WidgetProps>(props: P & WithScalarValue & StringRendererProps): React.ReactElement

export function NumberRenderer<P extends WidgetProps = WidgetProps>(props: P & WithScalarValue & NumberRendererProps): React.ReactElement

export function TextRenderer<P extends WidgetProps = WidgetProps>(props: P & WithScalarValue & TextRendererProps): React.ReactElement

import React from 'react'
import { WidgetRendererPropsExtended, rows } from '../../../../ui-schema/src/WidgetRendererProps'

export interface StringRendererProps extends WidgetRendererPropsExtended {
    // contains the index of the current schema level
    multiline?: boolean
    type: string
    rows?: rows
}

export interface NumberRendererProps extends StringRendererProps {
    type: string
}

export function StringRenderer<P extends StringRendererProps>(props: P): React.Component<P>

export function NumberRenderer<P extends NumberRendererProps>(props: P): React.Component<P>

export function TextRenderer<P extends StringRendererProps>(props: P): React.Component<P>

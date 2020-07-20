import React from 'react'
import { WidgetPropsWithValue } from '@ui-schema/ui-schema/Widget'
import { rows, multiline, type } from '@ui-schema/ui-schema/CommonTypings'

export interface StringRendererProps extends WidgetPropsWithValue {
    // contains the index of the current schema level
    multiline?: multiline
    type: type
    rows?: rows
    value: string
}

export interface NumberRendererProps extends WidgetPropsWithValue {
    type: type
    value: number
}

export function StringRenderer<P extends StringRendererProps>(props: P): React.Component<P>

export function NumberRenderer<P extends NumberRendererProps>(props: P): React.Component<P>

export function TextRenderer<P extends StringRendererProps>(props: P): React.Component<P>

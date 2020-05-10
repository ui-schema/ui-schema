import * as React from 'react'

export * from './Select'
import { WidgetRendererProps } from '../../../../ui-schema/src/WidgetRendererProps'

export interface WidgetRendererSelectInterface extends WidgetRendererProps {
    value: any
    multiple: false
}

export interface WidgetRendererSelectMultiInterface extends WidgetRendererProps {
    value: any
    multiple: true
}

export function Select<P extends WidgetRendererSelectInterface>(props: P): React.Component<P>

export function SelectMulti<P extends WidgetRendererSelectMultiInterface>(props: P): React.Component<P>

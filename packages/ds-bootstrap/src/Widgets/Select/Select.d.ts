import * as React from 'react'
export * from './Select'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface WidgetSelectInterface extends WidgetProps {
    value: string | number | boolean
    multiple: false
}

export interface WidgetSelectMultiInterface extends WidgetProps {
    value: string | number | boolean
    multiple: true
}

export function Select<P extends WidgetSelectInterface>(props: P): React.Component<P>

export function SelectMulti<P extends WidgetSelectMultiInterface>(props: P): React.Component<P>

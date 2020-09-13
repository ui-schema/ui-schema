import * as React from 'react'
export * from './Select'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface SelectProps extends WidgetProps {
    multiple?: boolean
}

export function Select<P extends SelectProps>(props: P): React.ReactElement<P>

export function SelectMulti<P extends WidgetProps>(props: P): React.ReactElement<P>

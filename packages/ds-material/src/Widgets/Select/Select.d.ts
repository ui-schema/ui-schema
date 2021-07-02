import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface SelectProps extends WidgetProps {
    multiple?: boolean
}

export interface SelectPropsMulti extends WidgetProps {
    multiple?: true
}

export function Select<P extends SelectProps>(props: P): React.ReactElement<P>

export function SelectMulti<P extends SelectPropsMulti>(props: P): React.ReactElement<P>

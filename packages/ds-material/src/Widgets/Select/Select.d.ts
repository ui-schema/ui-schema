import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { multiple } from '@ui-schema/ui-schema/CommonTypings'

export interface SelectProps extends WidgetProps {
    multiple: multiple
}

export interface SelectPropsMulti extends WidgetProps {
    multiple: true
}

export function Select<P extends SelectProps>(props: P): React.Component<P>

export function SelectMulti<P extends SelectPropsMulti>(props: P): React.Component<P>

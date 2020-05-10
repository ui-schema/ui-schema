import * as React from 'react'
import { WidgetRendererPropsExtended } from '../../../../ui-schema/src/WidgetRendererProps'

export interface SelectProps extends WidgetRendererPropsExtended {
    multiple: boolean
}

export interface SelectPropsMulti extends WidgetRendererPropsExtended {
    multiple: true
}

export function Select<P extends SelectProps>(props: P): React.Component<P>

export function SelectMulti<P extends SelectPropsMulti>(props: P): React.Component<P>

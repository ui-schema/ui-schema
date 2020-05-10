import * as React from 'react'
import { WidgetRendererPropsExtended } from '../../../../ui-schema/src/WidgetRendererProps'

export interface SimpleListProps extends WidgetRendererPropsExtended {
    valid: boolean
}

export function SimpleList<P extends SimpleListProps>(props: P): React.Component<P>

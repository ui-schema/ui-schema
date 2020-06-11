import * as React from 'react'
import { WidgetPropsExtended } from '@ui-schema/ui-schema/Widget'
import { valid } from '@ui-schema/ui-schema/CommonTypings'

export interface SimpleListProps extends WidgetPropsExtended {
    valid: valid
}

export function SimpleList<P extends SimpleListProps>(props: P): React.Component<P>

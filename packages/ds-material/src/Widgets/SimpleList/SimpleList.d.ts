import * as React from 'react'
import { WidgetPropsWithValue } from '@ui-schema/ui-schema/Widget'
import { valid } from '@ui-schema/ui-schema/CommonTypings'

export interface SimpleListProps extends WidgetPropsWithValue {
    valid: valid
}

export function SimpleList<P extends SimpleListProps>(props: P): React.Component<P>

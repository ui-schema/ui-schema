import * as React from 'react'
import { WidgetPropsExtended } from '@ui-schema/ui-schema/Widget'
import { multiple } from '@ui-schema/ui-schema/CommonTypings'

export interface SelectProps extends WidgetPropsExtended {
    multiple: multiple
}

export interface SelectPropsMulti extends WidgetPropsExtended {
    multiple: true
}

export function Select<P extends SelectProps>(props: P): React.Component<P>

export function SelectMulti<P extends SelectPropsMulti>(props: P): React.Component<P>

import * as React from 'react'
import { WidgetRendererProps } from '../../../../ui-schema/src/WidgetRendererProps'

export interface GenericListInterface extends WidgetRendererProps {
    valid: boolean
    required: boolean
}

export function GenericList<P extends GenericListInterface>(props: P): React.Component<P>

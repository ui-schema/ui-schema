import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { valid, required } from '@ui-schema/ui-schema/CommonTypings'

export interface GenericListInterface extends WidgetProps {
    valid: valid
    required: required
}

export function GenericList<P extends GenericListInterface>(props: P): React.Component<P>

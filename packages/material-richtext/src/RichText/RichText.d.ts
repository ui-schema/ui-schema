import * as React from 'react'
import { Map, List } from 'immutable'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface RichTextInterface extends WidgetProps {
    internalValue: Map<string|numebr, any> | List<[]>
    onlyInline: boolean
}

export function RichText<P extends RichTextInterface>(props: P): React.ReactElement<P>

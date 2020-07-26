import * as React from 'react'
import { Map, List } from 'immutable'
import { WidgetExtendedCheckValid } from '@ui-schema/ui-schema/Widget'

export interface RichTextInterface extends WidgetExtendedCheckValid {
    internalValue: Map<{}, undefined> | List<{}>
    onlyInline: boolean
}

export function RichText<P extends RichTextInterface>(props: P): React.Component<P>

import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { UIStoreInternalsType } from '@ui-schema/ui-schema'

export interface RichTextInterface extends WidgetProps {
    internalValue: UIStoreInternalsType
    onlyInline: boolean
}

export function RichText<P extends RichTextInterface>(props: P): React.ReactElement<P>

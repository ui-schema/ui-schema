import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export interface CodeProps extends WidgetProps {
    value: string
}

export function Code<P extends CodeProps>(props: P): React.ReactElement

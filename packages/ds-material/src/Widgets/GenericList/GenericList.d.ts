import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'

export function GenericList<P extends WidgetProps>(props: P): React.ReactElement<P>

import * as React from 'react'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'

export interface DefaultHandlerProps {
    doNotDefault?: boolean
    readOnly?: boolean
}

export function DefaultHandler<P extends WidgetPluginProps & DefaultHandlerProps>(props: P): React.ReactElement<P>

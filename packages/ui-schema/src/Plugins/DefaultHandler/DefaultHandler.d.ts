import * as React from 'react'
import { PluginProps } from '../../PluginStack/Plugin'

export interface DefaultHandlerProps {
    doNotDefault?: boolean
    readOnly?: boolean
}

export function DefaultHandler<P extends PluginProps & DefaultHandlerProps>(props: P): React.ReactElement<P>

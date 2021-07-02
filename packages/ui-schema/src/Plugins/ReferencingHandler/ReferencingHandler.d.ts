import * as React from 'react'
import { PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'

export function ReferencingHandler<P extends PluginProps & { rootContext?: { [k: string]: any } }>(props: P): React.ReactElement<P>

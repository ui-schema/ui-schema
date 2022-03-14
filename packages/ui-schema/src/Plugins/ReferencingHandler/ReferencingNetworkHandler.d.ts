import * as React from 'react'
import { PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'


/**
 * @param props
 * @constructor
 * @deprecated not needed anymore, `ReferencingHandler` supports root-level resolving without
 */
export function ReferencingNetworkHandler<P extends PluginProps>(props: P): React.ReactElement<P>

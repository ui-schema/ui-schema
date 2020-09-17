import * as React from "react"
import { PluginProps } from "../../PluginStack/Plugin"

export function ConditionalHandler<P extends PluginProps>(props: P): React.ReactElement<P>

import * as React from "react"
import { PluginProps } from "../../PluginStack/Plugin"

export function DefaultHandler<P extends PluginProps>(props: P): React.ReactElement<P>

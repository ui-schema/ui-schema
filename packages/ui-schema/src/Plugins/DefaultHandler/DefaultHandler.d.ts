import * as React from "react"
import { EditorPluginProps } from "../../EditorPlugin"

export function DefaultHandler<P extends EditorPluginProps>(props: P): React.Component<P>

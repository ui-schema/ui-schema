import * as React from "react"
import { EditorPluginProps } from "../../EditorPlugin"

export function CombiningHandler<P extends EditorPluginProps>(props: P): React.Component<P>

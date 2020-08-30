import * as React from "react"
import { EditorPluginProps } from "../../EditorPlugin"

export function DependentHandler<P extends EditorPluginProps>(props: P): React.ReactElement<P>

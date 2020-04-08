import * as React from "react"
import {EditorPluginProps} from "../Schema/EditorPlugin";

export function CombiningHandler<P extends EditorPluginProps>(props: P): React.Component<P>

import * as React from "react"
import { OrderedMap } from 'immutable'
import { widgetsBase } from "../widgetsBase"

export interface EditorPluginProps {
    schema: OrderedMap<{}, undefined>
    widgets: widgetsBase
}

export function EditorPlugin<P extends EditorPluginProps>(props: P): React.Component<P>

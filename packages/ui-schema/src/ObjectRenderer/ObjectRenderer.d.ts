import * as React from "react"
import { OrderedMap } from 'immutable'
import { StoreKeys } from "../EditorStore"

export interface ObjectRendererProps {
    schema: OrderedMap<{}, undefined>
    storeKeys: StoreKeys
    level: number
    widgets: {}
}

export function ObjectRenderer<P extends ObjectRendererProps>(props: P): React.Component<P>

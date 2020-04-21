import React from "react"
import { OrderedMap, List } from "immutable"

export interface TransTitleProps {
    schema: OrderedMap<{}, undefined>
    storeKeys: List<[]>
    ownKey: string | number
}

export function TransTitle<P extends TransTitleProps>(props: P): React.Component<P>

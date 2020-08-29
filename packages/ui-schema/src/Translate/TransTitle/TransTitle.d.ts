import React from "react"
import { OrderedMap } from "immutable"
import { StoreKeys } from "@ui-schema/ui-schema/EditorStore"

export interface TransTitleProps {
    schema: OrderedMap<{}, undefined>
    storeKeys: StoreKeys
    ownKey: string | number
}

export function TransTitle<P extends TransTitleProps>(props: P): React.ComponentType<P>

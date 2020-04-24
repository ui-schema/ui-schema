import React from 'react'
import { OrderedMap } from 'immutable'
import { StoreKeys } from "../EditorStore"

export interface WidgetRendererProps<> {
    parentSchema: OrderedMap<{}, undefined>
    storeKeys: StoreKeys
    level: number
}

export function WidgetRenderer(
    props: WidgetRendererProps
): React.ReactElement

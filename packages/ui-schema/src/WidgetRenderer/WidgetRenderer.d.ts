import React from 'react'
import { StoreKeys } from "../EditorStore"
import { schema } from '../CommonTypings'
import { WidgetProps } from "@ui-schema/ui-schema/Widget"

export interface WidgetRendererProps<> {
    parentSchema: schema
    storeKeys: StoreKeys
    level: number
}

export function WidgetRenderer(
    props: WidgetRendererProps
): React.Component<WidgetProps>

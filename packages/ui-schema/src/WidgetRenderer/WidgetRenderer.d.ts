import React from 'react'
import { StoreKeys } from "../EditorStore"
import { schema } from '../CommonTypings'

export interface WidgetRendererProps<> {
    parentSchema: schema
    storeKeys: StoreKeys
    level: number
}

export function WidgetRenderer(
    props: WidgetRendererProps
): React.ReactElement

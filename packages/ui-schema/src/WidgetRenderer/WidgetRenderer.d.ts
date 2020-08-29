import React from 'react'
import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"
import { schema } from "@ui-schema/ui-schema/CommonTypings"
import { StoreKeys } from "@ui-schema/ui-schema/EditorStore"

export interface WidgetRendererProps {
    level?: number
    schema: schema
    parentSchema: schema
    storeKeys: StoreKeys
}

export function WidgetRenderer(
    props: WidgetRendererProps
): React.Component<EditorPluginProps>

import React from 'react'
import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"
import { StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"
import { StoreKeys } from "@ui-schema/ui-schema/EditorStore"

export interface WidgetRendererProps {
    level?: number
    schema: StoreSchemaType
    parentSchema: StoreSchemaType
    storeKeys: StoreKeys
}

export function WidgetRenderer(
    props: WidgetRendererProps
): React.ReactElement<EditorPluginProps>

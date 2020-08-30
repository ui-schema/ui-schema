import * as React from "react"
import { EditorContext, StoreKeys } from "../EditorStore"
import { StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"

export interface NestedSchemaEditorProps {
    // the whole schema for this level
    schema: StoreSchemaType
    storeKeys: StoreKeys
    level?: number
    widgets?: EditorContext['widgets']
    t?: EditorContext['t']
    showValidity?: EditorContext['showValidity']
}

export function NestedSchemaEditor<P extends NestedSchemaEditorProps>(props: P): React.ReactElement

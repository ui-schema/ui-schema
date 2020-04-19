import * as React from "react"
import { OrderedMap } from 'immutable'
import { EditorContext, StoreKeys } from "./EditorStore"

export interface NestedSchemaEditorProps {
    // the whole schema for this level
    schema: OrderedMap<{}, undefined>
    storeKeys: StoreKeys
    level?: number
    widgets?: EditorContext['widgets']
    t?: EditorContext['t']
    showValidity?: EditorContext['showValidity']
}

export function NestedSchemaEditor<P extends NestedSchemaEditorProps>(props: P): React.Component

import * as React from "react"
import { EditorContext, EditorStoreContext } from "./EditorStore"

export interface SchemaEditorProviderProps extends EditorContext, EditorStoreContext {
    children?: React.ReactNode
}

export function SchemaEditorProvider<P extends SchemaEditorProviderProps>(props: P): React.Component

export function SchemaEditor<P extends SchemaEditorProviderProps>(props: P): React.Component

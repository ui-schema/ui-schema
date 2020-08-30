import * as React from "react"
import { EditorContext, EditorStoreContext } from "../EditorStore"

export function SchemaEditorProvider<P extends React.PropsWithChildren<EditorContext & EditorStoreContext>>(props: P): React.ReactElement

export function SchemaEditor<P extends React.PropsWithChildren<EditorContext & EditorStoreContext>>(props: P): React.ReactElement

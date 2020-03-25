import * as React from "react"
import { OrderedMap } from 'immutable'
import { EditorContext, EditorStoreContext, StoreKeys } from "./EditorStore"

export interface SchemaEditorRendererProps {
    schema: OrderedMap<{}, undefined>
    storeKeys: StoreKeys
    level: number
}

export function SchemaEditorRenderer<P extends SchemaEditorRendererProps>(props: P): React.Component<P>

export interface SchemaRootRendererData {
    // the whole schema, extracted from the provider
    schema: OrderedMap<{}, undefined>
    storeKeys: StoreKeys
}

export function SchemaRootRenderer(): React.Component<SchemaRootRendererData>

export interface NestedSchemaEditorProps {
    // the whole schema for this level
    schema: SchemaEditorRendererProps['schema']
    storeKeys: StoreKeys
    level?: SchemaEditorRendererProps['level']
    widgets?: EditorContext['widgets']
    t?: EditorContext['t']
    showValidity?: EditorContext['showValidity']
}

export function NestedSchemaEditor<P extends NestedSchemaEditorProps>(props: P): React.Component

export interface SchemaEditorProviderProps extends EditorContext, EditorStoreContext {
    children: []
}

export function SchemaEditorProvider<P extends SchemaEditorProviderProps>(props: P): React.Component

export function SchemaEditor<P extends SchemaEditorProviderProps>(props: P): React.Component

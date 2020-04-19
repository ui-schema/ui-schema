import * as React from "react"
import { OrderedMap } from 'immutable'
import { EditorContext, EditorStoreContext, StoreKeys } from "../Editor/EditorStore"

export interface SchemaRootRendererData {
    // the whole schema, extracted from the provider
    schema: OrderedMap<{}, undefined>
    storeKeys: StoreKeys
}

export function SchemaRootRenderer(): React.Component<SchemaRootRendererData>

import * as React from "react"
import { OrderedMap } from 'immutable'
import { StoreKeys } from "../EditorStore"

export interface SchemaRootRendererData {
    // the whole schema, extracted from the provider
    schema: OrderedMap<{}, undefined>
    storeKeys: StoreKeys
}

export function SchemaRootRenderer(): React.Component<SchemaRootRendererData>

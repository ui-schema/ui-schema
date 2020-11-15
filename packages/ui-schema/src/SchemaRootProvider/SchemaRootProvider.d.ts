import React from 'react'
import { ReferencingContext, StoreSchemaType } from '@ui-schema/ui-schema'

export interface SchemaRootContext {
    id: string
    // the root schema for e.g. JSONPointer resolving
    schema?: StoreSchemaType
}

export function SchemaRootProvider({id}: React.PropsWithChildren<SchemaRootContext>)

export function useSchemaRoot(): ReferencingContext

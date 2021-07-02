import React from 'react'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { OrderedMap } from 'immutable'

export interface SchemaRootContext {
    id?: string | undefined
    // the root schema for e.g. JSONPointer resolving
    schema?: StoreSchemaType
    definitions?: OrderedMap<string, StoreSchemaType>
}

export function SchemaRootProvider<C extends {} = { [k: string]: any }>(props: React.PropsWithChildren<SchemaRootContext & C>)

export function useSchemaRoot<C extends {} = { [k: string]: any }>(): SchemaRootContext & C

export function isRootSchema(schema: StoreSchemaType): boolean

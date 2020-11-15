import { List, Map } from 'immutable'
import { getSchema, ReferencingContext, StoreSchemaType } from '@ui-schema/ui-schema'

export type SchemaRefsPending = Map<string, List<string>>

export interface ParseRefsContent {
    // the definitions, could be get from ReferencingProvider
    defs: ReferencingContext['definitions']
    // the root schema, could be get from SchemaRootProvider
    schema?: StoreSchemaType
    // try to get a loaded schema
    fetchSchema?: getSchema
}

export function parseRefs(
    schema: StoreSchemaType,
    context: ParseRefsContent,
    // defaults to `false`
    recursive?: boolean,
    pending?: SchemaRefsPending
): {
    schema: StoreSchemaType
    pending: SchemaRefsPending
}

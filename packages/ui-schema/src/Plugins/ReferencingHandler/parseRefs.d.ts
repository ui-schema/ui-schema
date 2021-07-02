import { List, Map } from 'immutable'
import { getSchemaRefPlugin, SchemaRootContext, StoreSchemaType } from '@ui-schema/ui-schema'

/**
 * Pending references, grouped by root id, with requested versions per-schema,
 * `#` for no-custom context `$id`:
 * @example
 * {
 *     '#': {'ref-url': ['*', 'version']},
 *     'http://localhost/schema-1.json': {'schema-1b.json': ['*', '1.2']},
 * }
 */
export type SchemaRefsPending = Map<string, Map<string, List<string>>>

export interface ParseRefsContent {
    // the active root-id
    id?: string
    // the definitions, could be get from ReferencingProvider
    defs?: SchemaRootContext['definitions']
    // the root schema, could be get from SchemaRootProvider
    root?: StoreSchemaType
    // try to get a loaded schema
    getLoadedSchema?: getSchemaRefPlugin
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

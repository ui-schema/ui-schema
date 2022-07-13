import { List, Map } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { getSchemaRefPlugin } from '@ui-schema/react-json-schema/ReferencingHandler'
import { SchemaRootContext } from '@ui-schema/react-json-schema/SchemaRootProvider'

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
    root?: UISchemaMap
    // try to get a loaded schema
    getLoadedSchema?: getSchemaRefPlugin
}

export function parseRefs(
    schema: UISchemaMap,
    context: ParseRefsContent,
    // defaults to `false`
    recursive?: boolean,
    pending?: SchemaRefsPending
): {
    schema: UISchemaMap
    pending: SchemaRefsPending
}

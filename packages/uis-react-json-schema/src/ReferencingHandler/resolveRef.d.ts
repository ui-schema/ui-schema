import { ParseRefsContent } from '@ui-schema/react-json-schema/ReferencingHandler'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export class SchemaRefPending extends Error {
}

export function resolveRef(ref: string, context: ParseRefsContent, schemaVersion?: string): UISchemaMap

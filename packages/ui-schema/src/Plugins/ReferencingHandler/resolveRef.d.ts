import { ParseRefsContent, StoreSchemaType } from '@ui-schema/ui-schema'

export class SchemaRefPending extends Error {
}

export function resolveRef(ref: string, context: ParseRefsContent): StoreSchemaType

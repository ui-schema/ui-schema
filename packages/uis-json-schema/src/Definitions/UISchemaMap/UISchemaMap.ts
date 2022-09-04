import { JsonSchemaPureAny, UISchema } from '@ui-schema/json-schema/Definitions'
import { NestedOrderedMap } from '@ui-schema/system/createMap'

export type UISchemaMap<S extends JsonSchemaPureAny & UISchema = JsonSchemaPureAny & UISchema & { [k: string]: unknown }> =
    NestedOrderedMap<S>

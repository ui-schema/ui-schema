import { JsonSchemaPureAny, UISchema } from '@ui-schema/json-schema/Definitions'
import { NestedOrderedMap } from '@ui-schema/system/createMap'

/**
 * @todo this type leads to errors when passing to some functions, like in `resolveRef` usage of `resolvePointer`
 *       "Type instantiation is excessively deep and possibly infinite."
 */
export type UISchemaMap<S extends JsonSchemaPureAny & UISchema = JsonSchemaPureAny & UISchema & { [k: string]: unknown }> =
    NestedOrderedMap<S>

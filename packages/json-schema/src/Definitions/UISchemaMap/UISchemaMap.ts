import { JsonSchemaPureAny, UISchema } from '@ui-schema/json-schema/Definitions'
import { NestedOrderedMap } from '@ui-schema/ui-schema/createMap'
//import { FromJS } from 'immutable'

/**
 * @todo this type leads to errors when passing to some functions, like in `resolveRef` usage of `resolvePointer`
 *       "Type instantiation is excessively deep and possibly infinite."
 *       - using FromJS results in "typing is not portable" where this type is used;
 *         most likely doesn't happen with createMap from system, as either always used or not in node_modules,
 *         but it is using immutable, why doesn't that result in the portable error?
 * @todo use Pure and not PureAny for finalizing
 */
export type UISchemaMap<S extends JsonSchemaPureAny & UISchema = JsonSchemaPureAny & UISchema/* & { [k: string]: unknown }*/> =
    NestedOrderedMap<S>

// export type UISchemaMap<S extends JsonSchemaPureAny & UISchema = JsonSchemaPureAny & UISchema/* & { [k: string]: unknown }*/> =
//     FromJS<S>

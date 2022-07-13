import { OrderedMap } from 'immutable'
import { JsonSchema } from '@ui-schema/json-schema/Definitions/JsonSchema'

export type UISchemaMap<S extends JsonSchema = JsonSchema & { [k: string]: unknown }> = OrderedMap<keyof S, S[keyof S]>

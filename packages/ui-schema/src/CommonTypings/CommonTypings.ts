import { List, OrderedMap } from 'immutable'

export type showValidity = boolean

/**
 * @todo duplicated with json-schema, but no other way found as needed in react/system;
 *       and increase usage then across the board, to make `type` stricter
 */
export type SchemaKeywordType = 'string' | 'number' | 'integer' | 'boolean' | 'null' | 'object' | 'array'

export type SchemaTypesType = List<string> | string[] | string | undefined

/**
 * Placeholder alias, to be improved in a future version.
 *
 * @todo switch to `unknown` in 0.6.x, after removing all deprecations (as then its easier)
 */
export type SomeSchema = OrderedMap<string | number, any>

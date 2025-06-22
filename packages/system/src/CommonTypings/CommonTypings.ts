import { List, OrderedMap } from 'immutable'

export type showValidity = boolean

export type SchemaTypesType = List<string> | string[] | string | undefined

/**
 * Placeholder alias, to be improved in a future version.
 *
 * @todo switch to `unknown` in 0.6.x, after removing all deprecations (as then its easier)
 */
export type SomeSchema = OrderedMap<string | number, any>

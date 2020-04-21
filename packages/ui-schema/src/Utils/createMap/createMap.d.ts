import { List, Map, OrderedMap } from "immutable"

export function fromJSOrdered<P = {} | []>(js: P): OrderedMap<P, undefined> | List<P>

export function createOrderedMap<P = {}>(data?: P): OrderedMap<P, undefined>

export function createMap<P = {}>(data?: P): Map<P, undefined>

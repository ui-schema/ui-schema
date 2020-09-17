import { List, Map, OrderedMap } from "immutable"

export function fromJSOrdered<P = {} | []>(js: P): OrderedMap<keyof P, P[keyof P]> | List<P[keyof P]>

export function createOrderedMap<P = {}>(data?: P): OrderedMap<keyof P, P[keyof P]>

export function createMap<P = {}>(data?: P): Map<keyof P, P[keyof P]>

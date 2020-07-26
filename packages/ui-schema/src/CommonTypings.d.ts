import { OrderedMap, List } from 'immutable'
import * as React from 'react'

export type rows = number
export type rowsMax = number
export type ownKey = string
export type showValidity = boolean
export type errors = List<string>
export type required = boolean
export type valid = boolean
export type multiline = boolean
export type type = string
export type style = string
export type schema = OrderedMap<{}, undefined>
export type canDelete = boolean
export type children = React.Component
export type multipleOf = number
export type min = number
export type max = number
export type enumVal = number
export type constVal = number
export type defaultVal = number
export type minItems = number
export type maxItems = number
export type multiple = boolean

export type jsonSchema = {
    type: 'string',
    minLength?: number,
    maxLength?: number
} | {
    type: 'array',
    minItems?: number,
    maxItems?: number
} | {
    type: 'object',
    minProperties?: number,
    maxProperties?: number
} | {
    type: 'number' | 'integer',
    minimum?: number,
    maximum?: number,
    exclusiveMinimum?: number,
    exclusiveMaximum?: number
} | {
    type: 'null'
}

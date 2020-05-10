import * as React from 'react'
import { OrderedMap, List } from 'immutable'
import { validatorPluginExtended } from '@ui-schema/ui-schema/Validators/validate'

export type ERROR_DUPLICATE_ITEMS = string
export type ERROR_NOT_FOUND_CONTAINS = string
export type ERROR_ADDITIONAL_ITEMS = string

export type findDuplicates = string[]

export type validateArray = (schemaItems: OrderedMap<{}, undefined>, value: any, additionalItems: boolean, find: boolean) => boolean | string

export type validateItems = (schema: OrderedMap<{}, undefined>, value: any) => List<{}>

export type validateContains = (schema: OrderedMap<{}, undefined>, value: any) => List<{}>

// tslint:disable-next-line:no-empty-interface
export interface arrayValidator extends validatorPluginExtended {
}

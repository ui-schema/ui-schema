import { OrderedMap } from 'immutable'
import { ValidatorErrorsType } from "@ui-schema/ui-schema/ValidityReporter/ValidatorErrors"

export type showValidity = boolean
export type errors = ValidatorErrorsType
export type required = boolean
export type valid = boolean
export type StoreSchemaType = OrderedMap<any, any>

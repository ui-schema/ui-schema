import { List, Map, Record } from 'immutable'

export type ValidatorErrorsSingle = List<Map<string, any>>
export type ValidatorErrorsValue = Map<string, ValidatorErrorsSingle>

export interface ValidatorErrors {
    errCount: number
    errors: ValidatorErrorsValue
    childErrors: Map<string, any>
    errorsToJS: () => { [key: string]: { [key: string]: any }[] }
    getErrors: () => ValidatorErrorsValue
    addError: (type: string, context?: Map<any, any>) => ValidatorErrorsType
    addErrors: (errors: ValidatorErrorsType) => ValidatorErrorsType
    addChildErrors: (errors: ValidatorErrorsType) => ValidatorErrorsType
    hasError: (type?: string) => boolean
    getError: (type: string) => ValidatorErrorsSingle
}

export type ValidatorErrorsType = Record<ValidatorErrors> & ValidatorErrors

export const ValidatorErrors: ValidatorErrorsType

export function createValidatorErrors(): ValidatorErrorsType

import { List, Map, Record } from "immutable/dist/immutable-nonambient"

export interface ValidatorErrors {
    errCount: number
    errors: Map<{}, undefined>
    childErrors: Map<{}, undefined>
    errorsToJS: () => any
    getErrors: () => Map<{ [key: string]: List<any> }, undefined>
    addError: (type: string, context?: Map<any, any>) => ValidatorErrorsType
    addErrors: (errors: ValidatorErrorsType) => ValidatorErrorsType
    addChildError: (errors: ValidatorErrorsType) => ValidatorErrorsType
    hasError: (type?: string) => boolean
    getError: (type: string) => List<any>
}

export type ValidatorErrorsType = Record<ValidatorErrors> & ValidatorErrors

export const ValidatorErrors: ValidatorErrorsType

export function createValidatorErrors(): ValidatorErrorsType

import type { List, Map, MapOf } from 'immutable'

export interface ValidationErrorBasic {
    keywordLocation: string
    instanceLocation: string
    absoluteKeywordLocation?: string
    error?: string
}

export interface ValidationErrorDetailed extends ValidationErrorBasic {
    errors?: ValidationErrorDetailed[]
}

export interface ValidationErrorVerbose extends ValidationErrorDetailed {
    valid: boolean
    errors?: ValidationErrorVerbose[]
}

/**
 * @todo make interoperable with the spec, but which? basic should be the simplest to follow
 *       https://json-schema.org/draft/2020-12/json-schema-core#section-12.4
 *       https://github.com/ui-schema/ui-schema/issues/183
 */
export type ValidationResult = {
    valid: boolean
    /**
     * Failed validation errors.
     */
    errors: (ValidationErrorVerbose | ValidationErrorDetailed | ValidationErrorBasic)[]
    /**
     * Successful validation annotations.
     */
    annotations: unknown[]
}

interface ValidationError extends Partial<ValidationErrorBasic> {
    context?: object
    error: string
}

export interface ValidatorErrorsInterface {
    errCount: number
    errors: ValidationError[]
    // childErrors: Map<string, ValidatorErrorsType>

    //addError(error: { type: string, context?: Map<string, any> }): this

    addError(error: ValidationError | string): this

    //hasError: (type?: string) => boolean
    //getError: (type: string) => ValidatorErrorsSingle
}

/**
 * @todo only keep typing in `/system` and move state-class into `/json-schema`?
 */
export class ValidatorOutput implements ValidatorErrorsInterface {
    errCount = 0
    errors: ValidationError[] = []
    annotations: unknown[] = []

    addError(error: ValidationError | string): this {
        this.errors.push(typeof error === 'string' ? {error: error} : error)
        this.errCount++
        return this
    }
}

export type ValidationErrorImmutable = MapOf<Omit<ValidationError, 'context'> & { context?: Map<any, any> }>
export type ValidationErrorsImmutable = List<ValidationErrorImmutable>

export type onErrorHandler = (errors: ValidationErrorsImmutable | undefined) => void
